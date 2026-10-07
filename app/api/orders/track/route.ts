import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { checkRateLimit } from "@/lib/rate-limit";
import { getShippingProvider, TrackingEvent } from "@/lib/shipping";

const TrackOrderSchema = z.object({
  orderNumber: z.string().min(3),
  phone: z.string().min(4),
});

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") || "127.0.0.1";
    const rateCheck = checkRateLimit(`track_${ip}`, 15, 60 * 1000);
    if (!rateCheck.success) {
      return NextResponse.json({ error: "Too many tracking lookups. Please wait." }, { status: 429 });
    }

    const body = await req.json();
    const result = TrackOrderSchema.safeParse(body);
    if (!result.success) {
      return NextResponse.json({ error: "Please enter valid order number and phone number" }, { status: 400 });
    }

    const { orderNumber, phone } = result.data;
    const cleanPhone = phone.replace(/\D/g, "").slice(-10);

    const order = await db.order.findFirst({
      where: {
        number: { equals: orderNumber.trim() },
        customerPhone: { contains: cleanPhone },
      },
      include: {
        items: true,
      },
    });

    if (!order) {
      return NextResponse.json({ error: "No matching order found with these details." }, { status: 404 });
    }

    // Get courier tracking events if AWB exists
    let trackingEvents: TrackingEvent[] = [];
    if (order.awb) {
      const shippingProvider = getShippingProvider();
      trackingEvents = await shippingProvider.getTracking(order.awb);
    }

    return NextResponse.json({
      order: {
        id: order.id,
        number: order.number,
        status: order.status,
        paymentStatus: order.paymentStatus,
        customerName: order.customerName,
        deliveryDate: order.deliveryDate,
        trackingUrl: order.trackingUrl,
        awb: order.awb,
        createdAt: order.createdAt,
        total: order.total,
        itemsCount: order.items.reduce((s, i) => s + i.qty, 0),
        events: trackingEvents,
      },
    });
  } catch {
    return NextResponse.json({ error: "Failed to track order" }, { status: 500 });
  }
}
