/**
 * Parses Instagram Reel URL to extract shortcode
 * Supported formats:
 * - https://www.instagram.com/reel/C8xyz123/
 * - https://www.instagram.com/p/C8xyz123/
 * - https://instagr.am/reel/C8xyz123/
 * - C8xyz123
 */
export function extractInstagramShortcode(urlOrCode: string): string {
  if (!urlOrCode) return "";
  const trimmed = urlOrCode.trim();
  
  // If it's already just the shortcode
  if (/^[A-Za-z0-9_-]+$/.test(trimmed) && trimmed.length <= 15) {
    return trimmed;
  }

  const match = trimmed.match(/(?:reel|p)\/([A-Za-z0-9_-]+)/);
  if (match && match[1]) {
    return match[1];
  }

  return "";
}

/**
 * Builds the canonical Instagram Reel URL with UTM parameters
 */
export function buildInstagramUrlWithUtm(
  urlOrShortcode: string,
  options: {
    source?: string;
    medium?: string;
    campaign?: string;
  } = {}
): string {
  const shortcode = extractInstagramShortcode(urlOrShortcode);
  const baseUrl = shortcode
    ? `https://www.instagram.com/reel/${shortcode}/`
    : urlOrShortcode.startsWith("http")
    ? urlOrShortcode
    : `https://www.instagram.com/${process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || "little_luxehamper"}/`;

  try {
    const url = new URL(baseUrl);
    url.searchParams.set("utm_source", options.source || "website");
    url.searchParams.set("utm_medium", options.medium || "pdp_button");
    url.searchParams.set("utm_campaign", options.campaign || "reel_showcase");
    return url.toString();
  } catch {
    return baseUrl;
  }
}

/**
 * Builds embed iframe URL
 */
export function buildInstagramEmbedUrl(shortcode: string): string {
  const code = extractInstagramShortcode(shortcode);
  return `https://www.instagram.com/reel/${code}/embed/`;
}
