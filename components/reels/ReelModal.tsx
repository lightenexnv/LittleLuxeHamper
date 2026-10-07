"use client";

import React, { useEffect } from "react";
import { X, ExternalLink } from "lucide-react";
import { buildInstagramEmbedUrl, buildInstagramUrlWithUtm } from "@/lib/instagram";
import { trackInstagramClick } from "@/lib/analytics";

export interface ReelModalProps {
  isOpen: boolean;
  onClose: () => void;
  shortcode: string;
  instagramUrl: string;
  caption?: string;
  productSlug?: string;
  productName?: string;
}

export function ReelModal({
  isOpen,
  onClose,
  shortcode,
  instagramUrl,
  caption,
  productSlug,
  productName,
}: ReelModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const embedUrl = buildInstagramEmbedUrl(shortcode);
  const outUrl = buildInstagramUrlWithUtm(instagramUrl, {
    source: "website",
    medium: "reel_modal",
    campaign: "reel_strip",
  });

  const handleInstagramClick = () => {
    trackInstagramClick(instagramUrl, "reel_modal");
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="reel-modal-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/80 backdrop-blur-md animate-fade-in"
    >
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative z-10 w-full max-w-sm sm:max-w-md bg-white rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="p-3.5 bg-cream border-b border-blush flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-rose animate-ping" />
            <span id="reel-modal-title" className="font-serif font-bold text-wine text-sm">
              @little_luxehamper Reel
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-muted hover:text-ink rounded-full hover:bg-blush/40 transition-colors"
            aria-label="Close reel modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Facade iframe - mounted strictly on modal open */}
        <div className="relative w-full aspect-[9/16] max-h-[580px] bg-black">
          <iframe
            src={embedUrl}
            className="w-full h-full border-0"
            allowTransparency={true}
            allow="encrypted-media"
            title="Instagram Reel Video"
          />
        </div>

        {/* Footer info & CTA */}
        <div className="p-4 bg-white border-t border-blush/60 space-y-3">
          {caption && (
            <p className="text-xs text-ink/80 line-clamp-2 leading-relaxed font-sans">
              {caption}
            </p>
          )}

          <div className="flex flex-col sm:flex-row gap-2 pt-1">
            {productSlug && productName && (
              <a
                href={`/product/${productSlug}`}
                className="flex-1 py-2 px-3 text-center rounded-pill border border-wine text-wine text-xs font-semibold hover:bg-blush/30 transition-colors"
              >
                Shop {productName}
              </a>
            )}
            <a
              href={outUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleInstagramClick}
              className="flex-1 py-2 px-3 text-center rounded-pill text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-sm transition-all hover:opacity-95"
              style={{
                background: "linear-gradient(45deg, #F58529, #DD2A7B, #8134AF, #515BD4)",
              }}
            >
              <span>Watch on Instagram</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
