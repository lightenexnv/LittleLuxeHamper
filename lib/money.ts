/**
 * Format paise (integer) to INR string with ₹ symbol
 * e.g. 199900 -> "₹1,999"
 */
export function formatPrice(paise: number): string {
  const rupees = Math.round(paise / 100);
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(rupees);
}

/**
 * Format paise to plain rupee integer
 */
export function paiseToRupees(paise: number): number {
  return Math.round(paise / 100);
}

/**
 * Calculate discount percentage
 */
export function calculateDiscount(mrpPaise: number, pricePaise: number): number {
  if (!mrpPaise || mrpPaise <= pricePaise) return 0;
  return Math.round(((mrpPaise - pricePaise) / mrpPaise) * 100);
}
