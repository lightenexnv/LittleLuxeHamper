export interface OrderDTO {
  id: string;
  number: string;
  totalPaise: number;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  address?: Record<string, unknown>;
}

export interface WebhookResult {
  handled: boolean;
  orderId?: string;
  status?: "SUCCESS" | "FAILED" | "PENDING";
  paymentId?: string;
  raw?: unknown;
}

export interface PaymentProvider {
  name: string;
  createPayment(
    order: OrderDTO
  ): Promise<{ providerOrderId: string; clientPayload: Record<string, unknown> }>;
  verifyPayment(
    payload: Record<string, unknown>
  ): Promise<{ ok: boolean; paymentId?: string; error?: string }>;
  handleWebhook(req: Request): Promise<WebhookResult>;
  refund?(paymentId: string, amountPaise: number): Promise<{ ok: boolean; refundId?: string }>;
}
