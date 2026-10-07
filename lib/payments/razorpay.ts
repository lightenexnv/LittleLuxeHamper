import crypto from "crypto";
import { OrderDTO, PaymentProvider, WebhookResult } from "./provider";

export class RazorpayPaymentProvider implements PaymentProvider {
  name = "razorpay";
  private keyId: string;
  private keySecret: string;
  private webhookSecret: string;

  constructor() {
    this.keyId = process.env.RAZORPAY_KEY_ID || "";
    this.keySecret = process.env.RAZORPAY_KEY_SECRET || "";
    this.webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET || "";
  }

  async createPayment(order: OrderDTO) {
    if (!this.keyId || !this.keySecret) {
      throw new Error("Razorpay API credentials not configured");
    }

    const authHeader = Buffer.from(`${this.keyId}:${this.keySecret}`).toString("base64");
    const response = await fetch("https://api.razorpay.com/v1/orders", {
      method: "POST",
      headers: {
        Authorization: `Basic ${authHeader}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        amount: order.totalPaise,
        currency: "INR",
        receipt: order.number,
        notes: {
          orderId: order.id,
          customerName: order.customerName,
        },
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Razorpay order creation failed: ${errorText}`);
    }

    const rzpOrder = await response.json();

    return {
      providerOrderId: rzpOrder.id,
      clientPayload: {
        key: this.keyId,
        amount: rzpOrder.amount,
        currency: "INR",
        name: "Little Luxe Hamper",
        description: `Order #${order.number}`,
        order_id: rzpOrder.id,
        prefill: {
          name: order.customerName,
          email: order.customerEmail,
          contact: order.customerPhone,
        },
        theme: {
          color: "#6B2D3C",
        },
      },
    };
  }

  async verifyPayment(payload: Record<string, unknown>) {
    const razorpayOrderId = payload.razorpay_order_id as string;
    const razorpayPaymentId = payload.razorpay_payment_id as string;
    const razorpaySignature = payload.razorpay_signature as string;

    if (!razorpayOrderId || !razorpayPaymentId || !razorpaySignature) {
      return { ok: false, error: "Missing required Razorpay parameters" };
    }

    const expectedSignature = crypto
      .createHmac("sha256", this.keySecret)
      .update(`${razorpayOrderId}|${razorpayPaymentId}`)
      .digest("hex");

    const isMatch = crypto.timingSafeEqual(
      Buffer.from(expectedSignature),
      Buffer.from(razorpaySignature)
    );

    if (isMatch) {
      return { ok: true, paymentId: razorpayPaymentId };
    }

    return { ok: false, error: "Razorpay signature verification failed" };
  }

  async handleWebhook(req: Request): Promise<WebhookResult> {
    try {
      const rawBody = await req.text();
      const signature = req.headers.get("x-razorpay-signature");

      if (!signature) {
        return { handled: false, raw: "Missing signature header" };
      }

      const expectedSignature = crypto
        .createHmac("sha256", this.webhookSecret)
        .update(rawBody)
        .digest("hex");

      if (
        !crypto.timingSafeEqual(Buffer.from(expectedSignature), Buffer.from(signature))
      ) {
        return { handled: false, raw: "Invalid webhook signature" };
      }

      const event = JSON.parse(rawBody);
      const entity = event.payload?.payment?.entity;
      const orderNotes = entity?.notes || {};

      if (event.event === "payment.captured") {
        return {
          handled: true,
          orderId: orderNotes.orderId,
          paymentId: entity.id,
          status: "SUCCESS",
          raw: event,
        };
      }

      if (event.event === "payment.failed") {
        return {
          handled: true,
          orderId: orderNotes.orderId,
          paymentId: entity.id,
          status: "FAILED",
          raw: event,
        };
      }

      return { handled: true, raw: event };
    } catch (err) {
      return { handled: false, raw: err };
    }
  }

  async refund(paymentId: string, amountPaise: number) {
    const authHeader = Buffer.from(`${this.keyId}:${this.keySecret}`).toString("base64");
    const response = await fetch(
      `https://api.razorpay.com/v1/payments/${paymentId}/refund`,
      {
        method: "POST",
        headers: {
          Authorization: `Basic ${authHeader}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ amount: amountPaise }),
      }
    );

    if (!response.ok) {
      return { ok: false };
    }

    const data = await response.json();
    return { ok: true, refundId: data.id };
  }
}
