import { NextResponse } from "next/server";
import { getPaymentProvider } from "@/lib/payments";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  try {
    const paymentProvider = getPaymentProvider();
    const result = await paymentProvider.handleWebhook(req);

    if (!result.handled) {
      return NextResponse.json({ error: "Unhandled or invalid webhook" }, { status: 400 });
    }

    if (result.orderId && result.status) {
      const order = await db.order.findUnique({
        where: { id: result.orderId },
      });

      if (order) {
        if (result.status === "SUCCESS") {
          await db.order.update({
            where: { id: order.id },
            data: {
              status: "CONFIRMED",
              paymentStatus: "PAID",
            },
          });
        } else if (result.status === "FAILED") {
          await db.order.update({
            where: { id: order.id },
            data: {
              paymentStatus: "FAILED",
              status: "FAILED",
            },
          });
        }
      }
    }

    return NextResponse.json({ ok: true, result });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json({ error: "Webhook handler failed" }, { status: 500 });
  }
}
