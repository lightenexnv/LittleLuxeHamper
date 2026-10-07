import { describe, it, expect } from "vitest";
import { formatPrice, paiseToRupees, calculateDiscount } from "@/lib/money";

describe("Money Utilities", () => {
  it("formats paise to Indian Rupee notation correctly", () => {
    expect(formatPrice(199900)).toBe("₹1,999");
    expect(formatPrice(349900)).toBe("₹3,499");
    expect(formatPrice(89900)).toBe("₹899");
  });

  it("converts paise to plain rupee integers", () => {
    expect(paiseToRupees(150000)).toBe(1500);
    expect(paiseToRupees(9900)).toBe(99);
  });

  it("calculates percentage discounts accurately", () => {
    // 2499 vs 2999 mrp
    const disc = calculateDiscount(299900, 249900);
    expect(disc).toBe(17);

    // No discount if mrp <= price
    expect(calculateDiscount(10000, 10000)).toBe(0);
    expect(calculateDiscount(8000, 10000)).toBe(0);
  });
});
