import React from "react";
import Image from "next/image";
import { Instagram, Plus, ExternalLink, Sparkles } from "lucide-react";
import { db } from "@/lib/db";
import { AdminReelAddForm } from "@/components/admin/AdminReelAddForm";

export const dynamic = "force-dynamic";

export default async function AdminReelsPage() {
  const reels = await db.reel.findMany({
    include: {
      product: { select: { id: true, name: true, slug: true } },
    },
    orderBy: { sort: "asc" },
  });

  const products = await db.product.findMany({
    select: { id: true, name: true },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="font-serif text-3xl font-bold text-wine">
          Instagram Reels Management
        </h1>
        <p className="text-xs text-muted mt-1">
          Store Instagram reel metadata without runtime API scraping. Configure posters and link reels to product galleries and the homepage strip.
        </p>
      </div>

      {/* Add New Reel Card */}
      <AdminReelAddForm products={products} />

      {/* Reels Grid */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-blush/80 shadow-sm space-y-4">
        <h2 className="font-serif font-bold text-wine text-xl pb-2 border-b border-blush/50">
          Configured Reels ({reels.length})
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-5">
          {reels.map((r) => (
            <div
              key={r.id}
              className="rounded-2xl border border-blush/70 overflow-hidden bg-cream flex flex-col justify-between"
            >
              <div className="relative aspect-[9/16] bg-ink">
                <Image
                  src={r.posterUrl}
                  alt={r.caption}
                  fill
                  sizes="200px"
                  className="object-cover"
                />
                <div className="absolute top-2 left-2 bg-black/60 text-white text-[10px] font-mono px-2 py-0.5 rounded-full backdrop-blur-sm">
                  @{r.shortcode}
                </div>
                {r.showOnHome && (
                  <div className="absolute bottom-2 left-2 bg-gold text-white text-[9px] font-bold px-1.5 py-0.5 rounded uppercase">
                    On Home Strip
                  </div>
                )}
              </div>

              <div className="p-3 text-xs space-y-2">
                <p className="text-ink/80 line-clamp-2 leading-snug">{r.caption}</p>

                {r.product && (
                  <p className="text-[11px] text-wine font-semibold flex items-center gap-1">
                    <Sparkles className="w-3 h-3 text-gold" />
                    <span className="truncate">{r.product.name}</span>
                  </p>
                )}

                <div className="pt-2 border-t border-blush/40 flex justify-between items-center text-[11px]">
                  <a
                    href={r.instagramUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-wine font-semibold hover:underline flex items-center gap-1"
                  >
                    <span>View Reel</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
