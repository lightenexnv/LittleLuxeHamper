import { MockShippingProvider } from "./mock";
import { ShippingProvider } from "./provider";
import { ShiprocketShippingProvider } from "./shiprocket";

export function getShippingProvider(): ShippingProvider {
  const providerType = process.env.SHIPPING_PROVIDER?.toLowerCase() || "mock";

  if (providerType === "shiprocket") {
    return new ShiprocketShippingProvider();
  }

  return new MockShippingProvider();
}

export * from "./provider";
export * from "./mock";
export * from "./shiprocket";
