"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Instagram, Sparkles, ExternalLink } from "lucide-react";
import { ReelModal } from "@/components/reels/ReelModal";
import { buildInstagramUrlWithUtm } from "@/lib/instagram";
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
  const [activeReel, setActiveReel] = useState<ReelItem | null>(null);

  if (!reels || reels.length === 0) return null;

  // Duplicate items for continuous auto-scroll marquee effect
  const displayList = [...reels, ...reels, ...reels];

  return (
    <section className="py-16 bg-cream overflow-hidden border-y border-blush/60">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 mb-8 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-rose-dark text-xs font-semibold uppercase tracking-widest mb-1.5">
            <Instagram className="w-4 h-4" />
            <span>As Seen On Instagram</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-wine">
            Unboxing Real Emotions
          </h2>
          <p className="text-sm text-muted mt-1 max-w-lg">
            Behind every satin bow lies a bespoke story. Tap any reel to watch our hamper styling in action.
          </p>
        </div>

        <a
          href={`https://instagram.com/${process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || "little_luxehamper"}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackInstagramClick("profile_link", "reels_strip_header")}
          className="inline-flex items-center gap-2 text-xs font-semibold px-4 py-2 rounded-full border border-wine text-wine hover:bg-wine hover:text-white transition-all w-fit"
        >
          <span>Follow @little_luxehamper</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </a>
      </div>

      {/* Marquee Container with pause-on-hover */}
      <div className="relative w-full overflow-hidden group">
        <div className="flex gap-5 w-max animate-marquee pause-on-hover py-4 px-4">
          {displayList.map((reel, idx) => (
            <div
              key={`${reel.id}-${idx}`}
              onClick={() => setActiveReel(reel)}
              className="relative w-48 sm:w-56 aspect-[9/16] rounded-card overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 cursor-pointer shrink-0 border border-blush/70 group/card bg-ink"
            >
              <Image
                src={reel.posterUrl}
                alt={reel.caption}
                fill
                sizes="(max-width: 640px) 192px, 224px"
                className="object-cover transition-transform duration-500 group-hover/card:scale-105"
              />

              {/* Gradient Dark Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-ink/80 via-transparent to-black/30" />

              {/* Instagram & Status Badges */}
              <div className="absolute top-3 inset-x-3 flex items-center justify-between">
                <span className="p-1.5 rounded-full bg-black/40 text-white backdrop-blur-sm">
                  <Instagram className="w-3.5 h-3.5" />
                </span>
                {reel.isSample ? (
                  <span className="bg-gold/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                    SAMPLE
                  </span>
                ) : (
                  <span className="bg-wine/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase tracking-wider">
                    ORIGINAL
                  </span>
                )}
              </div>

              {/* Center Play Button Facade */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-12 h-12 rounded-full bg-white/80 group-hover/card:bg-white text-wine flex items-center justify-center shadow-lg transition-transform duration-300 group-hover/card:scale-110">
                  <Play className="w-5 h-5 fill-current ml-0.5" />
                </div>
              </div>

              {/* Bottom Caption & Product Link Chip */}
              <div className="absolute bottom-3 inset-x-3 space-y-2">
                <p className="text-white text-xs font-medium line-clamp-2 leading-snug drop-shadow-sm font-sans">
                  {reel.caption}
                </p>

                {reel.product && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="inline-block"
                  >
                    <Link
                      href={`/product/${reel.product.slug}`}
                      className="inline-flex items-center gap-1 bg-white/90 hover:bg-white text-wine text-[10px] font-bold px-2 py-0.5 rounded-full backdrop-blur-sm shadow-sm transition-colors"
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

      {/* Reel Modal on click */}
      {activeReel && (
        <ReelModal
          isOpen={!!activeReel}
          onClose={() => setActiveReel(null)}
          shortcode={activeReel.shortcode}
          instagramUrl={activeReel.instagramUrl}
          videoUrl={activeReel.videoUrl}
          caption={activeReel.caption}
          productSlug={activeReel.product?.slug}
          productName={activeReel.product?.name}
        />
      )}
    </section>
  );
}

