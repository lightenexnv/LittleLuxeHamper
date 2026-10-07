import { NextResponse } from "next/server";
import { CheckoutSchema } from "@/lib/validators";
import { checkRateLimit } from "@/lib/rate-limit";
import { db } from "@/lib/db";
import { computePricing, ResolvedCartItem } from "@/lib/pricing";
import { getPaymentProvider } from "@/lib/payments";

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const rateCheck = checkRateLimit(`checkout_${ip}`, 10, 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json({ error: "Too many checkout requests. Please wait." }, { status: 429 });
    }

    const body = await req.json();
    const result = CheckoutSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json(
        { error: "Validation failed", details: result.error.flatten() },
        { status: 400 }
      );
    }

    const data = result.data;

    // Fetch DB products to ensure authentic pricing
    const productIds = data.items.map((i) => i.productId);
    const dbProducts = await db.product.findMany({
      where: { id: { in: productIds }, isActive: true },
    });

    const allAddOnIds = data.items.flatMap((i) => i.addOnIds || []);
    const dbAddOns = await db.addOn.findMany({
      where: { id: { in: allAddOnIds }, isActive: true },
    });

    const resolvedItems: ResolvedCartItem[] = [];

    for (const input of data.items) {
      const dbProd = dbProducts.find((p) => p.id === input.productId);
      if (!dbProd) {
        return NextResponse.json(
          { error: `Product not available or out of stock: ${input.productId}` },
          { status: 400 }
        );
      }

      if (dbProd.stock < input.qty) {
        return NextResponse.json(
          { error: `Insufficient stock for ${dbProd.name}. Available: ${dbProd.stock}` },
          { status: 400 }
        );
      }

      const attachedAddOns = (input.addOnIds || [])
        .map((aId) => dbAddOns.find((a) => a.id === aId))
        .filter(Boolean)
        .map((a) => ({
          id: a!.id,
          name: a!.name,
          pricePaise: a!.pricePaise,
        }));

      resolvedItems.push({
        productId: dbProd.id,
        name: dbProd.name,
        slug: dbProd.slug,
        imageUrl: "",
        pricePaise: dbProd.pricePaise,
        mrpPaise: dbProd.mrpPaise,
        qty: input.qty,
        itemTotalPaise: dbProd.pricePaise * input.qty,
        addOns: attachedAddOns,
      });
    }

    // Coupon verification
    let couponRecord = null;
    if (data.couponCode) {
      const foundCoupon = await db.coupon.findUnique({
        where: { code: data.couponCode.trim().toUpperCase() },
      });
      if (
        foundCoupon &&
        foundCoupon.isActive &&
        (!foundCoupon.expiresAt || new Date(foundCoupon.expiresAt) > new Date())
      ) {
        couponRecord = {
          code: foundCoupon.code,
          type: foundCoupon.type as "PERCENT" | "FLAT",
          value: foundCoupon.value,
          minOrder: foundCoupon.minOrder,
        };
      }
    }

    const pricing = computePricing({
      items: resolvedItems,
      coupon: couponRecord,
      isCod: data.paymentMethod === "COD",
    });

    // Generate Order Number: LLH-YYMM-XXXX
    const now = new Date();
    const datePrefix = `${now.getFullYear().toString().slice(-2)}${String(
      now.getMonth() + 1
    ).padStart(2, "0")}`;
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const orderNumber = `LLH-${datePrefix}-${randomSuffix}`;

    // Create Order in DB
    const newOrder = await db.order.create({
      data: {
        number: orderNumber,
        status: data.paymentMethod === "COD" ? "CONFIRMED" : "PLACED",
        paymentStatus: data.paymentMethod === "COD" ? "PENDING" : "PENDING",
        paymentMethod: data.paymentMethod,
        subtotal: pricing.subtotalPaise + pricing.addOnsTotalPaise,
        discount: pricing.discountPaise,
        shipping: pricing.shippingPaise,
        codFee: pricing.codFeePaise,
        total: pricing.totalPaise,
        customerName: data.customerName,
        customerEmail: data.customerEmail,
        customerPhone: data.customerPhone,
        recipientName: data.recipientName || data.customerName,
        recipientPhone: data.recipientPhone || data.customerPhone,
        address: JSON.stringify({
          addressLine1: data.addressLine1,
          addressLine2: data.addressLine2,
          landmark: data.landmark,
          pincode: data.pincode,
          city: data.city,
          state: data.state,
          gstin: data.gstin,
        }),
        deliveryDate: data.deliveryDate,
        giftMessage: data.giftMessage,
        couponCode: data.couponCode,
        items: {
          create: resolvedItems.map((item) => ({
            productId: item.productId,
            nameSnapshot: item.name,
            pricePaise: item.pricePaise,
            qty: item.qty,
            addOns: JSON.stringify(item.addOns),
          })),
        },
      },
    });

    // If COD, we directly confirm order and return
    if (data.paymentMethod === "COD") {
      return NextResponse.json({
        ok: true,
        orderId: newOrder.id,
        orderNumber: newOrder.number,
        isCod: true,
      });
    }

    // Call PaymentProvider
    const paymentProvider = getPaymentProvider();
    const paymentInit = await paymentProvider.createPayment({
      id: newOrder.id,
      number: newOrder.number,
      totalPaise: newOrder.total,
      customerName: newOrder.customerName,
      customerEmail: newOrder.customerEmail,
      customerPhone: newOrder.customerPhone,
    });

    return NextResponse.json({
      ok: true,
      orderId: newOrder.id,
      orderNumber: newOrder.number,
      provider: paymentProvider.name,
      clientPayload: paymentInit.clientPayload,
    });
  } catch (error) {
    console.error("Checkout processing error:", error);
    return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
  }
}
