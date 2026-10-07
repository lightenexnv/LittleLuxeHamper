declare global {
  interface Window {
    gtag?: (...args: unknown[]) => void;
    fbq?: (...args: unknown[]) => void;
  }
}

export function trackEvent(eventName: string, params: Record<string, unknown> = {}) {
  if (typeof window === "undefined") return;

  // Google Analytics 4
  if (typeof window.gtag === "function") {
    window.gtag("event", eventName, params);
  }

  // Meta Pixel
  if (typeof window.fbq === "function") {
    if (eventName === "purchase") {
      window.fbq("track", "Purchase", {
        value: (params.value as number) || 0,
        currency: "INR",
      });
    } else if (eventName === "add_to_cart") {
      window.fbq("track", "AddToCart", {
        content_name: params.item_name,
        value: params.value,
        currency: "INR",
      });
    } else if (eventName === "begin_checkout") {
      window.fbq("track", "InitiateCheckout");
    } else if (eventName === "view_item") {
      window.fbq("track", "ViewContent", {
        content_name: params.item_name,
      });
    } else {
      window.fbq("trackCustom", eventName, params);
    }
  }

  // Console log in development for observability
  if (process.env.NODE_ENV === "development") {
    console.log(`[Analytics Event] ${eventName}:`, params);
  }
}

export function trackInstagramClick(reelUrl?: string, location?: string) {
  trackEvent("instagram_click", {
    reel_url: reelUrl,
    click_location: location || "pdp_button",
  });
}

export function trackWhatsAppClick(productName?: string) {
  trackEvent("whatsapp_click", {
    product_name: productName,
  });
}
