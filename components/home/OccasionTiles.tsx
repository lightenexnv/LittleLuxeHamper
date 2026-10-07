import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles } from "lucide-react";

interface OccasionItem {
  name: string;
  slug: string;
  image: string;
  tagline: string;
}

const occasions: OccasionItem[] = [
  {
    name: "Everlasting Bouquets",
    slug: "eternal-bouquets",
    image: "/media/images/3944067240609796323_23802205442.webp",
    tagline: "Handcrafted florals that never wilt",
  },
  {
    name: "Birthday Celebrations",
    slug: "celebration-trunks",
    image: "/media/images/3971308063021843388_25237603949_1.webp",
    tagline: "Illuminated keepsake trunks",
  },
  {
    name: "Festive & Rakhi Trunks",
    slug: "occasion-hampers",
    image: "/media/images/3954806144118936893_25237603949.webp",
    tagline: "Bhai & Bhabhi artisan luxury",
  },
  {
    name: "Eternal Rose Romance",
    slug: "eternal-bouquets",
    image: "/media/images/3981723450503017365_23802205442_1.webp",
    tagline: "Crimson & ivory velvet blooms",
  },
  {
    name: "Gentleman's Luxury",
    slug: "celebration-trunks",
    image: "/media/images/4000538639129881934_25237603949_1.webp",
    tagline: "Polo & Calvin Klein essentials",
  },
  {
    name: "Artisan Keepsakes",
    slug: "occasion-hampers",
    image: "/media/images/3988244139536006049_23802205442_1.webp",
    tagline: "Plush panda & crochet flowers",
  },
];

export function OccasionTiles() {
  return (
    <section className="py-20 bg-white border-b border-blush/60 relative">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blush/40 text-wine text-xs font-semibold uppercase tracking-wider mb-2">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span>Curated Gifting Collections</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-mulberry tracking-tight">
            Curated For Every Milestone
          </h2>
          <p className="text-sm text-muted mt-2 font-sans">
            Thoughtfully styled gift sets handcrafted for life&apos;s most cherished celebrations.
          </p>
        </div>

        {/* Responsive grid of arch-masked cards with hover zoom & label slide */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4 sm:gap-6">
          {occasions.map((occ) => (
            <Link
              key={occ.name}
              href={`/collections/${occ.slug}`}
              className="group flex flex-col items-center text-center focus:outline-none"
            >
              {/* Arch Mask Container */}
              <div className="relative w-full aspect-[3/4] rounded-t-[54px] rounded-b-[20px] overflow-hidden shadow-luxe-card group-hover:shadow-luxe-lg border-2 border-blush/60 group-hover:border-gold transition-all duration-500 bg-sand/30">
                <Image
                  src={occ.image}
                  alt={occ.name}
                  fill
                  sizes="(max-width: 640px) 45vw, (max-width: 1024px) 30vw, 16vw"
                  className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                {/* Bottom slide-up text overlay */}
                <div className="absolute bottom-3 inset-x-2 text-white transform transition-transform duration-300 group-hover:-translate-y-1">
                  <h3 className="font-serif font-bold text-xs sm:text-sm drop-shadow-sm leading-tight">
                    {occ.name}
                  </h3>
                  <p className="text-[10px] text-white/80 line-clamp-1 mt-0.5 font-sans font-normal opacity-90">
                    {occ.tagline}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
