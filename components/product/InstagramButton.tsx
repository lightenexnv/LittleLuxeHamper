"use client";

import React from "react";
import { Instagram, ExternalLink } from "lucide-react";
import { buildInstagramUrlWithUtm } from "@/lib/instagram";
import { trackInstagramClick } from "@/lib/analytics";

export function InstagramButton({
  reelUrl,
  productName,
}: {
  reelUrl?: string;
  productName: string;
}) {
  const handle = process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || "little_luxehamper";
  const targetUrl = buildInstagramUrlWithUtm(
    reelUrl || `https://www.instagram.com/${handle}/`,
    {
      source: "website",
      medium: "pdp_button",
      campaign: "reel_showcase",
    }
  );

  const handleClick = () => {
    trackInstagramClick(targetUrl, "pdp_under_gallery");
  };

  return (
    <a
      data-testid="pdp-instagram-button"
      href={targetUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={handleClick}
      className="w-full py-3.5 px-6 rounded-pill text-white font-semibold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md hover:shadow-lg transition-all duration-300 transform active:scale-98 group"
      style={{
        background: "linear-gradient(45deg, #F58529, #DD2A7B, #8134AF, #515BD4)",
      }}
      aria-label={`View ${productName} on Instagram`}
    >
      <Instagram className="w-4 h-4 transition-transform group-hover:rotate-12" />
      <span>{reelUrl ? "View Reel on Instagram" : `Follow @${handle} on Instagram`}</span>
      <ExternalLink className="w-3.5 h-3.5 ml-0.5 opacity-80" />
    </a>
  );
}
