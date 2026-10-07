"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Play, Instagram, ExternalLink, Sparkles } from "lucide-react";
import { ReelModal } from "./ReelModal";
import { buildInstagramUrlWithUtm } from "@/lib/instagram";
import { trackInstagramClick } from "@/lib/analytics";

export interface ReelGalleryItem {
  id: string;
  instagramUrl: string;
  shortcode: string;
  posterUrl: string;
  caption: string;
  product?: {
    slug: string;
    name: string;
    pricePaise: number;
  } | null;
}

export function ReelsGalleryGrid({ reels }: { reels: ReelGalleryItem[] }) {
  const [activeReel, setActiveReel] = useState<ReelGalleryItem | null>(null);

  return (
    <div>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {reels.map((reel) => {
          const outUrl = buildInstagramUrlWithUtm(reel.instagramUrl, {
            source: "website",
            medium: "reels_grid",
            campaign: "reel_gallery",
          });

          return (
            <div
              key={reel.id}
              className="bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-luxe border border-blush/70 flex flex-col transition-all group"
            >
              {/* Poster 9:16 Stage with Facade */}
              <div
                onClick={() => setActiveReel(reel)}
                className="relative aspect-[9/16] cursor-pointer overflow-hidden bg-ink"
              >
                <Image
                  src={reel.posterUrl}
                  alt={reel.caption}
                  fill
                  sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />

                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/20" />

                <div className="absolute top-3 left-3 bg-black/50 text-white p-1.5 rounded-full backdrop-blur-sm">
                  <Instagram className="w-3.5 h-3.5" />
                </div>

                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/80 group-hover:bg-white text-wine flex items-center justify-center shadow-lg transition-transform group-hover:scale-110">
                    <Play className="w-6 h-6 fill-current ml-1" />
                  </div>
                </div>

                {reel.product && (
                  <div
                    onClick={(e) => e.stopPropagation()}
                    className="absolute bottom-3 left-3 right-3"
                  >
                    <Link
                      href={`/product/${reel.product.slug}`}
                      className="block bg-white/90 hover:bg-white text-wine text-xs font-semibold px-3 py-1.5 rounded-full backdrop-blur-sm shadow-sm transition-all"
                    >
                      <div className="flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-gold shrink-0" />
                        <span className="truncate">{reel.product.name}</span>
                      </div>
                    </Link>
                  </div>
                )}
              </div>

              {/* Caption & External Link */}
              <div className="p-4 flex-1 flex flex-col justify-between space-y-3">
                <p className="text-xs text-ink/80 line-clamp-2 leading-relaxed">
                  {reel.caption}
                </p>

                <div className="pt-1 border-t border-blush/40 flex items-center justify-between">
                  <button
                    onClick={() => setActiveReel(reel)}
                    className="text-xs font-semibold text-wine hover:underline"
                  >
                    Watch Preview
                  </button>

                  <a
                    href={outUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => trackInstagramClick(reel.instagramUrl, "reels_grid")}
                    className="text-xs font-bold text-rose-dark hover:text-wine flex items-center gap-1"
                  >
                    <span>Instagram</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {activeReel && (
        <ReelModal
          isOpen={!!activeReel}
          onClose={() => setActiveReel(null)}
          shortcode={activeReel.shortcode}
          instagramUrl={activeReel.instagramUrl}
          caption={activeReel.caption}
          productSlug={activeReel.product?.slug}
          productName={activeReel.product?.name}
        />
      )}
    </div>
  );
}
