export interface CartItemInput {
  productId: string;
  qty: number;
  addOnIds?: string[];
}

export interface ResolvedCartItem {
  productId: string;
  name: string;
  slug: string;
  imageUrl: string;
  pricePaise: number;
  mrpPaise: number;
  qty: number;
  itemTotalPaise: number;
  addOns: {
    id: string;
    name: string;
    pricePaise: number;
  }[];
}

export interface PricingCalculationResult {
  items: ResolvedCartItem[];
  subtotalPaise: number;
  addOnsTotalPaise: number;
  discountPaise: number;
  shippingPaise: number;
  codFeePaise: number;
  totalPaise: number;
  freeShippingThresholdPaise: number;
  amountNeededForFreeShippingPaise: number;
  appliedCoupon?: {
    code: string;
    type: string;
    value: number;
    discountPaise: number;
  };
}

export const FREE_SHIPPING_THRESHOLD_PAISE = 149900; // Free shipping over ₹1,499
export const STANDARD_SHIPPING_PAISE = 9900; // ₹99 standard shipping
export const COD_FEE_PAISE = 4900; // ₹49 COD fee

export function computePricing({
  items,
  coupon,
  isCod = false,
}: {
  items: ResolvedCartItem[];
  coupon?: {
    code: string;
    type: "PERCENT" | "FLAT";
    value: number;
    minOrder: number;
  } | null;
  isCod?: boolean;
}): PricingCalculationResult {
  let subtotalPaise = 0;
  let addOnsTotalPaise = 0;

  for (const item of items) {
    subtotalPaise += item.pricePaise * item.qty;
    for (const addon of item.addOns) {
      addOnsTotalPaise += addon.pricePaise * item.qty;
    }
  }

  const combinedItemsTotal = subtotalPaise + addOnsTotalPaise;

  let discountPaise = 0;
  let appliedCoupon: PricingCalculationResult["appliedCoupon"] | undefined = undefined;

  if (coupon && combinedItemsTotal >= coupon.minOrder) {
    if (coupon.type === "PERCENT") {
      discountPaise = Math.round((combinedItemsTotal * coupon.value) / 100);
    } else if (coupon.type === "FLAT") {
      discountPaise = coupon.value;
    }

    if (discountPaise > combinedItemsTotal) {
      discountPaise = combinedItemsTotal;
    }

    appliedCoupon = {
      code: coupon.code,
      type: coupon.type,
      value: coupon.value,
      discountPaise,
    };
  }

  const shippingPaise =
    combinedItemsTotal >= FREE_SHIPPING_THRESHOLD_PAISE ? 0 : STANDARD_SHIPPING_PAISE;

  const codFeePaise = isCod ? COD_FEE_PAISE : 0;

  const totalPaise = Math.max(0, combinedItemsTotal - discountPaise + shippingPaise + codFeePaise);

  const amountNeededForFreeShippingPaise = Math.max(
    0,
    FREE_SHIPPING_THRESHOLD_PAISE - combinedItemsTotal
  );

  return {
    items,
    subtotalPaise,
    addOnsTotalPaise,
    discountPaise,
    shippingPaise,
    codFeePaise,
    totalPaise,
    freeShippingThresholdPaise: FREE_SHIPPING_THRESHOLD_PAISE,
    amountNeededForFreeShippingPaise,
    appliedCoupon,
  };
}
