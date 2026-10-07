import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getPaymentProvider } from "@/lib/payments";
import { getShippingProvider } from "@/lib/shipping";

export async function POST(req: Request) {
  try {
    const payload = await req.json();
    const orderId = payload.orderId;

    if (!orderId) {
      return NextResponse.json({ error: "Missing order ID" }, { status: 400 });
    }

    const order = await db.order.findUnique({
      where: { id: orderId },
      include: { items: true },
    });

    if (!order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    const paymentProvider = getPaymentProvider();
    const verifyResult = await paymentProvider.verifyPayment(payload);

    if (verifyResult.ok) {
      // Payment Succeeded!
      // Run transaction: decrement stock, record payment, update order status
      const paymentId = verifyResult.paymentId || `pay_${Date.now()}`;

      await db.$transaction(async (tx) => {
        // Record payment
        await tx.payment.create({
          data: {
            orderId: order.id,
            provider: paymentProvider.name,
            providerPaymentId: paymentId,
            status: "SUCCESS",
            raw: JSON.stringify(payload),
          },
        });

        // Decrement item stock
        for (const item of order.items) {
          if (item.productId) {
            await tx.product.update({
              where: { id: item.productId },
              data: {
                stock: {
                  decrement: item.qty,
                },
              },
            });
          }
        }

        // Generate tracking & AWB
        const shippingProvider = getShippingProvider();
        const shipment = await shippingProvider.createShipment({
          id: order.id,
          number: order.number,
          totalPaise: order.total,
          customerName: order.customerName,
          customerEmail: order.customerEmail,
          customerPhone: order.customerPhone,
        });

        // Update order status
        await tx.order.update({
          where: { id: order.id },
          data: {
            status: "CONFIRMED",
            paymentStatus: "PAID",
            awb: shipment.awb,
            trackingUrl: shipment.trackingUrl,
          },
        });
      });

      return NextResponse.json({
        ok: true,
        orderId: order.id,
        orderNumber: order.number,
      });
    } else {
      // Payment Failed or Pending
      const isPending = payload.status === "PENDING";
      const statusToSet = isPending ? "PENDING" : "FAILED";

      await db.payment.create({
        data: {
          orderId: order.id,
          provider: paymentProvider.name,
          providerPaymentId: verifyResult.paymentId || null,
          status: statusToSet,
          raw: JSON.stringify(payload),
        },
      });

      await db.order.update({
        where: { id: order.id },
        data: {
          paymentStatus: statusToSet,
          status: isPending ? "PLACED" : "FAILED",
        },
      });

      return NextResponse.json({
        ok: false,
        error: verifyResult.error || "Payment was not successful",
        status: statusToSet,
      });
    }
  } catch (error) {
    console.error("Payment verification error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
