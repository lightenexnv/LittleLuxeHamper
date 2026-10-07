"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Instagram, Sparkles, ExternalLink } from "lucide-react";
import { ReelModal } from "@/components/reels/ReelModal";
import { trackInstagramClick } from "@/lib/analytics";

export interface ReelItem {
  id: string;
  instagramUrl: string;
  shortcode: string;
  posterUrl: string;
  videoUrl?: string | null;
  caption: string;
  isSample?: boolean;
  product?: {
    slug: string;
    name: string;
  } | null;
}

export function ReelsStrip({ reels }: { reels: ReelItem[] }) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  if (!reels || reels.length === 0) return null;

  // Split into 2 rows for opposite scrolling
  const half = Math.ceil(reels.length / 2);
  const row1 = reels.slice(0, half);
  const row2 = reels.slice(half);

  // Duplicate for seamless loop
  const displayRow1 = [...row1, ...row1, ...row1];
  const displayRow2 = [...row2, ...row2, ...row2];

  const handleOpenReel = (reel: ReelItem) => {
    const idx = reels.findIndex((r) => r.id === reel.id);
    setActiveIndex(idx >= 0 ? idx : 0);
  };

  const handlePrev = () => {
    if (activeIndex !== null && activeIndex > 0) {
      setActiveIndex(activeIndex - 1);
    }
  };

  const handleNext = () => {
    if (activeIndex !== null && activeIndex < reels.length - 1) {
      setActiveIndex(activeIndex + 1);
    }
  };

  const currentReel = activeIndex !== null ? reels[activeIndex] : null;

  return (
    <section className="py-12 sm:py-20 bg-gradient-to-b from-cream via-sand/30 to-cream overflow-hidden border-y border-blush/80 relative">
      {/* Paper texture overlay */}
      <div className="absolute inset-0 bg-grain opacity-40 pointer-events-none" />

      {/* Header with Follow CTA */}
      <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6 mb-6 sm:mb-10 flex flex-col md:flex-row md:items-end justify-between gap-4 sm:gap-5">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-light/20 text-rose-dark text-[11px] sm:text-xs font-semibold uppercase tracking-widest mb-2">
            <Instagram className="w-3.5 h-3.5" />
            <span>As Seen on Instagram Reels</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-mulberry tracking-tight">
            Unboxing Real Emotions
          </h2>
          <p className="text-xs sm:text-base text-muted mt-1.5 sm:mt-2 max-w-xl font-sans">
            Behind every satin bow lies a bespoke story. Tap any reel to watch our unboxings, 
            handpacked details, and bespoke client reactions.
          </p>
        </div>

        <a
          href={`https://instagram.com/${process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || "little_luxehamper"}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackInstagramClick("profile_link", "reels_strip_header")}
          className="inline-flex items-center gap-2 text-xs font-semibold px-4 sm:px-5 py-2 sm:py-2.5 rounded-full border border-wine/70 text-wine bg-white/80 hover:bg-wine hover:text-white transition-all shadow-xs w-fit"
        >
          <span>Follow @little_luxehamper</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Row 1: Scrolling Left */}
      <div className="relative w-full overflow-hidden group mb-3 sm:mb-6">
        <div className="flex gap-3.5 sm:gap-5 w-max animate-marquee pause-on-hover py-1.5 sm:py-2 px-3 sm:px-4 will-change-transform">
          {displayRow1.map((reel, idx) => (
            <div
              key={`r1-${reel.id}-${idx}`}
              onClick={() => handleOpenReel(reel)}
              className="relative w-36 sm:w-56 aspect-[9/16] rounded-2xl sm:rounded-card overflow-hidden shadow-luxe-card hover:shadow-luxe-lg transition-all duration-300 cursor-pointer shrink-0 border border-white/80 group/card bg-black transform hover:-translate-y-1 hover:scale-[1.03]"
            >
              <Image
                src={reel.posterUrl}
                alt={reel.caption}
                fill
                sizes="(max-width: 640px) 192px, 224px"
                className="object-cover transition-transform duration-500 group-hover/card:scale-105"
              />

              {/* Gradient Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 pointer-events-none" />

              {/* Top Badges */}
              <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                <span className="p-1.5 rounded-full bg-black/50 text-white backdrop-blur-sm">
                  <Instagram className="w-3.5 h-3.5" />
                </span>
                <span className="bg-wine/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-sm shadow-sm">
                  REEL
                </span>
              </div>

              {/* Center Play Button Facade */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/85 group-hover/card:bg-white text-wine flex items-center justify-center shadow-lg transition-transform duration-300 group-hover/card:scale-110">
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </div>
              </div>

              {/* Bottom Caption & Product Link Chip */}
              <div className="absolute bottom-3 inset-x-3 space-y-2">
                <p className="text-white text-xs font-medium line-clamp-2 leading-snug drop-shadow-sm font-sans">
                  {reel.caption}
                </p>

                {reel.product && (
                  <div onClick={(e) => e.stopPropagation()} className="inline-block">
                    <Link
                      href={`/product/${reel.product.slug}`}
                      className="inline-flex items-center gap-1 bg-white/95 hover:bg-white text-wine text-[10px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-sm shadow-sm transition-colors"
                    >
                      <Sparkles className="w-2.5 h-2.5 text-gold" />
                      <span>{reel.product.name}</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Row 2: Scrolling Right (Continuous in Opposite Direction) */}
      <div className="relative w-full overflow-hidden group">
        <div className="flex gap-3.5 sm:gap-5 w-max animate-marquee-reverse pause-on-hover py-1.5 sm:py-2 px-3 sm:px-4 will-change-transform">
          {displayRow2.map((reel, idx) => (
            <div
              key={`r2-${reel.id}-${idx}`}
              onClick={() => handleOpenReel(reel)}
              className="relative w-36 sm:w-56 aspect-[9/16] rounded-2xl sm:rounded-card overflow-hidden shadow-luxe-card hover:shadow-luxe-lg transition-all duration-300 cursor-pointer shrink-0 border border-white/80 group/card bg-black transform hover:-translate-y-1 hover:scale-[1.03]"
            >
              <Image
                src={reel.posterUrl}
                alt={reel.caption}
                fill
                sizes="(max-width: 640px) 192px, 224px"
                className="object-cover transition-transform duration-500 group-hover/card:scale-105"
              />

              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-black/30 pointer-events-none" />

              <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                <span className="p-1.5 rounded-full bg-black/50 text-white backdrop-blur-sm">
                  <Instagram className="w-3.5 h-3.5" />
                </span>
                <span className="bg-gold/90 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider backdrop-blur-sm shadow-sm">
                  UNBOXING
                </span>
              </div>

              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/85 group-hover/card:bg-white text-wine flex items-center justify-center shadow-lg transition-transform duration-300 group-hover/card:scale-110">
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </div>
              </div>

              <div className="absolute bottom-3 inset-x-3 space-y-2">
                <p className="text-white text-xs font-medium line-clamp-2 leading-snug drop-shadow-sm font-sans">
                  {reel.caption}
                </p>

                {reel.product && (
                  <div onClick={(e) => e.stopPropagation()} className="inline-block">
                    <Link
                      href={`/product/${reel.product.slug}`}
                      className="inline-flex items-center gap-1 bg-white/95 hover:bg-white text-wine text-[10px] font-bold px-2.5 py-0.5 rounded-full backdrop-blur-sm shadow-sm transition-colors"
                    >
                      <Sparkles className="w-2.5 h-2.5 text-gold" />
                      <span>{reel.product.name}</span>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Fullscreen Reel Viewer Modal */}
      {currentReel && (
        <ReelModal
          isOpen={!!currentReel}
          onClose={() => setActiveIndex(null)}
          shortcode={currentReel.shortcode}
          instagramUrl={currentReel.instagramUrl}
          videoUrl={currentReel.videoUrl}
          caption={currentReel.caption}
          productSlug={currentReel.product?.slug}
          productName={currentReel.product?.name}
          onPrev={handlePrev}
          onNext={handleNext}
          hasPrev={activeIndex !== null && activeIndex > 0}
          hasNext={activeIndex !== null && activeIndex < reels.length - 1}
        />
      )}
    </section>
  );
}
