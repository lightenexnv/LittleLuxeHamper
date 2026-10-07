/**
 * Strips HTML tags and trims string, enforcing maximum length
 */
export function sanitizeText(input: string | undefined | null, maxLength = 250): string {
  if (!input) return "";
  // Strip HTML tags
  const stripped = input.replace(/<[^>]*>?/gm, "").trim();
  // Enforce max length
  return stripped.slice(0, maxLength);
}

/**
 * Validates Indian 6-digit PIN code
 */
export function isValidPincode(pin: string): boolean {
  return /^[1-9][0-9]{5}$/.test(pin.trim());
}

/**
 * Validates Indian 10-digit mobile number (allows +91 or leading 0)
 */
export function isValidIndianPhone(phone: string): boolean {
  const cleaned = phone.replace(/[\s\-\(\)\+]/g, "");
  return /(?:91)?[6-9]\d{9}$/.test(cleaned);
}

/**
 * Formats phone number to +91 XXXXX XXXXX format
 */
export function formatIndianPhone(phone: string): string {
  const digits = phone.replace(/\D/g, "");
  const last10 = digits.slice(-10);
  if (last10.length === 10) {
    return `+91 ${last10.slice(0, 5)} ${last10.slice(5)}`;
  }
  return phone;
}
