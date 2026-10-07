"use client";

import React, { useEffect } from "react";
import { X, ExternalLink, ChevronLeft, ChevronRight, Instagram } from "lucide-react";
import { buildInstagramEmbedUrl, buildInstagramUrlWithUtm } from "@/lib/instagram";
import { trackInstagramClick } from "@/lib/analytics";

export interface ReelModalProps {
  isOpen: boolean;
  onClose: () => void;
  shortcode: string;
  instagramUrl: string;
  videoUrl?: string | null;
  caption?: string;
  productSlug?: string;
  productName?: string;
  onPrev?: () => void;
  onNext?: () => void;
  hasPrev?: boolean;
  hasNext?: boolean;
}

export function ReelModal({
  isOpen,
  onClose,
  shortcode,
  instagramUrl,
  videoUrl,
  caption,
  productSlug,
  productName,
  onPrev,
  onNext,
  hasPrev,
  hasNext,
}: ReelModalProps) {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && onPrev) onPrev();
      if (e.key === "ArrowRight" && onNext) onNext();
    };
    if (isOpen) {
      document.body.style.overflow = "hidden";
      window.addEventListener("keydown", handleKeyDown);
    }
    return () => {
      document.body.style.overflow = "unset";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [isOpen, onClose, onPrev, onNext]);

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
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/85 backdrop-blur-md animate-fade-in"
    >
      <div className="absolute inset-0" onClick={onClose} aria-hidden="true" />

      {/* Prev Navigation Button */}
      {hasPrev && onPrev && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPrev();
          }}
          className="hidden md:flex absolute left-4 lg:left-8 z-20 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 text-white items-center justify-center backdrop-blur-md transition-all"
          aria-label="Previous reel"
        >
          <ChevronLeft className="w-6 h-6" />
        </button>
      )}

      {/* Next Navigation Button */}
      {hasNext && onNext && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onNext();
          }}
          className="hidden md:flex absolute right-4 lg:right-8 z-20 w-12 h-12 rounded-full bg-white/20 hover:bg-white/40 text-white items-center justify-center backdrop-blur-md transition-all"
          aria-label="Next reel"
        >
          <ChevronRight className="w-6 h-6" />
        </button>
      )}

      <div className="relative z-10 w-full max-w-sm sm:max-w-md bg-white rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[92vh] border border-white/20">
        {/* Header */}
        <div className="p-3.5 bg-cream border-b border-blush flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="p-1 rounded-full bg-gradient-to-tr from-gold to-rose text-white">
              <Instagram className="w-3.5 h-3.5" />
            </span>
            <span id="reel-modal-title" className="font-serif font-bold text-wine text-sm">
              @little_luxehamper
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

        {/* Video / Embed Player */}
        <div className="relative w-full aspect-[9/16] max-h-[560px] bg-black flex items-center justify-center">
          {videoUrl ? (
            <video
              src={videoUrl}
              controls
              autoPlay
              playsInline
              className="w-full h-full object-contain"
            />
          ) : (
            <iframe
              src={embedUrl}
              className="w-full h-full border-0"
              allowTransparency={true}
              allow="encrypted-media"
              title="Instagram Reel Video"
            />
          )}
        </div>

        {/* Footer info & Gradient Instagram CTA */}
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
                className="flex-1 py-2.5 px-3 text-center rounded-pill border border-wine text-wine text-xs font-semibold hover:bg-blush/30 transition-colors flex items-center justify-center"
              >
                Shop {productName}
              </a>
            )}
            <a
              href={outUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={handleInstagramClick}
              className="flex-1 py-2.5 px-3 text-center rounded-pill text-white text-xs font-semibold flex items-center justify-center gap-1.5 shadow-md transition-all hover:opacity-95 transform hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(45deg, #F58529, #DD2A7B, #8134AF, #515BD4)",
              }}
            >
              <span>Watch on Instagram ↗</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
