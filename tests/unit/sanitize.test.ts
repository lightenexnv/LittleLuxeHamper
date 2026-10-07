import { describe, it, expect } from "vitest";
import {
  sanitizeText,
  isValidPincode,
  isValidIndianPhone,
} from "@/lib/sanitize";

describe("Sanitization & Validation Utilities", () => {
  it("strips HTML tags and enforces character length limits", () => {
    const malicious = "<script>alert('hack')</script>Happy Birthday <b>Priya</b>!";
    const cleaned = sanitizeText(malicious, 50);
    expect(cleaned).not.toContain("<script>");
    expect(cleaned).not.toContain("<b>");
    expect(cleaned).toBe("alert('hack')Happy Birthday Priya!");

    // Truncates if exceeds max length
    const longText = "A".repeat(300);
    expect(sanitizeText(longText, 250).length).toBe(250);
  });

  it("validates Indian 6-digit PIN codes accurately", () => {
    expect(isValidPincode("560001")).toBe(true);
    expect(isValidPincode("110001")).toBe(true);
    expect(isValidPincode("012345")).toBe(false); // First digit cannot be 0
    expect(isValidPincode("56000")).toBe(false); // 5 digits
    expect(isValidPincode("5600011")).toBe(false); // 7 digits
    expect(isValidPincode("ABCDEF")).toBe(false);
  });

  it("validates Indian 10-digit mobile numbers", () => {
    expect(isValidIndianPhone("9876543210")).toBe(true);
    expect(isValidIndianPhone("+91 98765 43210")).toBe(true);
    expect(isValidIndianPhone("918888888888")).toBe(true);
    expect(isValidIndianPhone("1234567890")).toBe(false); // Must start with 6-9
    expect(isValidIndianPhone("987654")).toBe(false);
  });
});
