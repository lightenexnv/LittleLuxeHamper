import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { computePricing, ResolvedCartItem } from "@/lib/pricing";
import { CartPriceSchema } from "@/lib/validators";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const parsed = CartPriceSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: "Invalid cart payload", details: parsed.error }, { status: 400 });
    }

    const { items: inputItems, couponCode, isCod } = parsed.data;

    // Fetch products from DB to strictly validate server-side prices
    const productIds = inputItems.map((item) => item.productId);
    const dbProducts = await db.product.findMany({
      where: { id: { in: productIds }, isActive: true },
      include: { images: { orderBy: { sort: "asc" }, take: 1 } },
    });

    // Fetch all referenced add-ons
    const allAddOnIds = inputItems.flatMap((item) => item.addOnIds || []);
    const dbAddOns = await db.addOn.findMany({
      where: { id: { in: allAddOnIds }, isActive: true },
    });

    const resolvedItems: ResolvedCartItem[] = [];

    for (const input of inputItems) {
      const dbProd = dbProducts.find((p) => p.id === input.productId);
      if (!dbProd) continue;

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
        imageUrl: dbProd.images[0]?.url || "/images/products/royal-velvet-anniversary-hamper-1.svg",
        pricePaise: dbProd.pricePaise,
        mrpPaise: dbProd.mrpPaise,
        qty: input.qty,
        itemTotalPaise: dbProd.pricePaise * input.qty,
        addOns: attachedAddOns,
      });
    }

    // Validate coupon from DB if provided
    let couponRecord = null;
    if (couponCode) {
      const foundCoupon = await db.coupon.findUnique({
        where: { code: couponCode.trim().toUpperCase() },
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
      isCod: !!isCod,
    });

    return NextResponse.json(pricing);
  } catch (error) {
    console.error("Pricing calculation error:", error);
    return NextResponse.json({ error: "Failed to compute pricing" }, { status: 500 });
  }
}
