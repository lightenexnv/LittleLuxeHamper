import { DummyPaymentProvider } from "./dummy";
import { PaymentProvider } from "./provider";
import { RazorpayPaymentProvider } from "./razorpay";

export function getPaymentProvider(): PaymentProvider {
  const providerType = process.env.PAYMENT_PROVIDER?.toLowerCase() || "dummy";

  if (providerType === "razorpay") {
    return new RazorpayPaymentProvider();
  }

  return new DummyPaymentProvider();
}

export * from "./provider";
export * from "./dummy";
export * from "./razorpay";
