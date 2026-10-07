import { describe, it, expect } from "vitest";
import {
  computePricing,
  FREE_SHIPPING_THRESHOLD_PAISE,
  STANDARD_SHIPPING_PAISE,
  COD_FEE_PAISE,
  ResolvedCartItem,
} from "@/lib/pricing";

describe("Pricing Engine", () => {
  const sampleItem: ResolvedCartItem = {
    productId: "prod_1",
    name: "Luxury Hamper",
    slug: "luxury-hamper",
    imageUrl: "/test.svg",
    pricePaise: 100000, // ₹1,000
    mrpPaise: 120000,
    qty: 1,
    itemTotalPaise: 100000,
    addOns: [
      { id: "add_1", name: "Card", pricePaise: 15000 }, // ₹150
    ],
  };

  it("calculates subtotal and applies standard shipping when below threshold", () => {
    const result = computePricing({
      items: [sampleItem],
    });

    // Subtotal: 100000, Addons: 15000 -> Combined: 115000 (₹1,150)
    expect(result.subtotalPaise).toBe(100000);
    expect(result.addOnsTotalPaise).toBe(15000);
    // Combined is below ₹1,499 threshold -> standard shipping applied
    expect(result.shippingPaise).toBe(STANDARD_SHIPPING_PAISE);
    expect(result.totalPaise).toBe(115000 + STANDARD_SHIPPING_PAISE);
    expect(result.amountNeededForFreeShippingPaise).toBe(
      FREE_SHIPPING_THRESHOLD_PAISE - 115000
    );
  });

  it("provides free shipping when total items exceed threshold", () => {
    const doubleItem = { ...sampleItem, qty: 2 };
    const result = computePricing({
      items: [doubleItem],
    });

    // Combined: (100000 + 15000) * 2 = 230000 (₹2,300) > ₹1,499
    expect(result.shippingPaise).toBe(0);
    expect(result.amountNeededForFreeShippingPaise).toBe(0);
    expect(result.totalPaise).toBe(230000);
  });

  it("applies percentage coupon discounts correctly", () => {
    const result = computePricing({
      items: [{ ...sampleItem, qty: 2 }],
      coupon: {
        code: "TEST10",
        type: "PERCENT",
        value: 10,
        minOrder: 100000,
      },
    });

    // 230000 - 10% (23000) = 207000
    expect(result.appliedCoupon?.discountPaise).toBe(23000);
    expect(result.totalPaise).toBe(207000);
  });

  it("applies flat coupons and adds COD fee if selected", () => {
    const result = computePricing({
      items: [{ ...sampleItem, qty: 2 }],
      coupon: {
        code: "FLAT100",
        type: "FLAT",
        value: 10000, // ₹100
        minOrder: 100000,
      },
      isCod: true,
    });

    // Combined 230000 - 10000 = 220000 + COD fee 4900 = 224900
    expect(result.codFeePaise).toBe(COD_FEE_PAISE);
    expect(result.totalPaise).toBe(220000 + COD_FEE_PAISE);
  });
});
