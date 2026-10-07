import { describe, it, expect } from "vitest";
import {
  extractInstagramShortcode,
  buildInstagramUrlWithUtm,
  buildInstagramEmbedUrl,
} from "@/lib/instagram";

describe("Instagram Utilities", () => {
  it("extracts shortcode from standard reel URLs", () => {
    expect(
      extractInstagramShortcode("https://www.instagram.com/reel/C8xyz123/")
    ).toBe("C8xyz123");
    expect(
      extractInstagramShortcode("https://instagram.com/p/DB12345/?igsh=abc")
    ).toBe("DB12345");
    expect(extractInstagramShortcode("C8xyz123")).toBe("C8xyz123");
  });

  it("builds Instagram URL with campaign and UTM params", () => {
    const url = buildInstagramUrlWithUtm("https://www.instagram.com/reel/C8xyz123/", {
      source: "website",
      medium: "pdp_button",
      campaign: "festive_push",
    });

    expect(url).toContain("utm_source=website");
    expect(url).toContain("utm_medium=pdp_button");
    expect(url).toContain("utm_campaign=festive_push");
  });

  it("builds embed iframe URL correctly", () => {
    expect(buildInstagramEmbedUrl("C8xyz123")).toBe(
      "https://www.instagram.com/reel/C8xyz123/embed/"
    );
  });
});
