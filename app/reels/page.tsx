import React from "react";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { constructMetadata } from "@/lib/seo";
import { ReelsStrip } from "@/components/home/ReelsStrip";
import { ReelsGalleryGrid } from "@/components/reels/ReelsGalleryGrid";

export const revalidate = 300;

export const metadata: Metadata = constructMetadata({
  title: "Watch Hamper Styling Reels | Little Luxe Hamper",
  description:
    "Explore our collection of Instagram unboxing, packing, and aesthetic gift styling reels. Follow @little_luxehamper.",
  canonicalUrl: "/reels",
});

export default async function ReelsPage() {
  const reels = await db.reel.findMany({
    include: {
      product: {
        select: { slug: true, name: true, pricePaise: true },
      },
    },
    orderBy: { sort: "asc" },
  });

  return (
    <div className="bg-cream min-h-screen py-12">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold text-gold uppercase tracking-widest">
            Visual Storytelling
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-wine mt-1">
            Instagram Reels Atelier
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-2">
            Watch our master artisans tie silk satin ribbons, curate fragrant botanicals, and handpack luxury gifts.
          </p>
        </div>

        <ReelsGalleryGrid reels={reels} />
      </div>
    </div>
  );
}
