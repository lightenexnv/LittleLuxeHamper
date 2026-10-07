import { OrderDTO, PaymentProvider, WebhookResult } from "./provider";

export class DummyPaymentProvider implements PaymentProvider {
  name = "dummy";

  async createPayment(order: OrderDTO) {
    const dummyOrderId = `dummy_order_${order.number}_${Date.now()}`;
    return {
      providerOrderId: dummyOrderId,
      clientPayload: {
        provider: "dummy",
        orderId: order.id,
        orderNumber: order.number,
        amountPaise: order.totalPaise,
        currency: "INR",
        customerName: order.customerName,
        customerEmail: order.customerEmail,
        isTestMode: true,
      },
    };
  }

  async verifyPayment(payload: Record<string, unknown>) {
    const status = payload.status as string;
    const orderId = payload.orderId as string;
    const paymentId = (payload.paymentId as string) || `dummy_pay_${Date.now()}`;

    if (status === "SUCCESS") {
      return { ok: true, paymentId };
    }

    return {
      ok: false,
      paymentId,
      error: status === "PENDING" ? "Payment is pending verification" : "Simulated payment failure",
    };
  }

  async handleWebhook(req: Request): Promise<WebhookResult> {
    try {
      const body = (await req.json()) as {
        event: string;
        orderId: string;
        paymentId?: string;
        status: "SUCCESS" | "FAILED" | "PENDING";
      };

      return {
        handled: true,
        orderId: body.orderId,
        paymentId: body.paymentId || `dummy_hook_${Date.now()}`,
        status: body.status,
        raw: body,
      };
    } catch (err) {
      return { handled: false, raw: err };
    }
  }

  async refund(paymentId: string, amountPaise: number) {
    return {
      ok: true,
      refundId: `dummy_ref_${paymentId}_${amountPaise}`,
    };
  }
}
