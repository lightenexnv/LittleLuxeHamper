import React from "react";
import Link from "next/link";
import Image from "next/image";

interface OccasionItem {
  name: string;
  slug: string;
  image: string;
  tagline: string;
}

const occasions: OccasionItem[] = [
  {
    name: "Festive & Diwali",
    slug: "festive-gifting",
    image: "/images/products/golden-festive-diwali-hamper-1.svg",
    tagline: "Brass diyas & sweets",
  },
  {
    name: "Birthdays",
    slug: "birthday-hampers",
    image: "/images/products/blush-elegance-birthday-hamper-1.svg",
    tagline: "Joyful surprises",
  },
  {
    name: "Anniversary",
    slug: "anniversary-celebration",
    image: "/images/products/royal-velvet-anniversary-hamper-1.svg",
    tagline: "Everlasting romance",
  },
  {
    name: "Weddings",
    slug: "wedding-hampers",
    image: "/images/products/blooming-love-wedding-hamper-1.svg",
    tagline: "Heirloom trunks",
  },
  {
    name: "Self-Care & Spa",
    slug: "self-care-pamper",
    image: "/images/products/celestial-pamper-self-care-hamper-1.svg",
    tagline: "Calming rejuvenation",
  },
  {
    name: "Newborn Baby",
    slug: "baby-shower-newborn",
    image: "/images/products/sweet-beginnings-newborn-hamper-1.svg",
    tagline: "Tender welcomes",
  },
];

export function OccasionTiles() {
  return (
    <section className="py-14 bg-white border-b border-blush/60">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-10">
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-wine">
            Shop By Occasion
          </h2>
          <p className="text-xs sm:text-sm text-muted mt-2">
            Curated gift sets thoughtfully styled for India&apos;s most cherished celebrations.
          </p>
        </div>

        {/* Scrollable list on mobile, responsive grid on desktop */}
        <div className="flex md:grid md:grid-cols-6 gap-5 overflow-x-auto pb-4 md:pb-0 hide-scrollbar snap-x snap-mandatory">
          {occasions.map((occ) => (
            <Link
              key={occ.slug}
              href={`/collections/${occ.slug}`}
              className="flex flex-col items-center text-center group shrink-0 w-36 md:w-auto snap-center"
            >
              <div className="relative w-28 h-28 sm:w-32 sm:h-32 rounded-full overflow-hidden border-2 border-blush group-hover:border-gold transition-all duration-300 shadow-sm group-hover:shadow-md bg-cream">
                <Image
                  src={occ.image}
                  alt={occ.name}
                  fill
                  sizes="128px"
                  className="object-cover group-hover:scale-110 transition-transform duration-500"
                />
              </div>
              <h3 className="font-serif font-bold text-ink group-hover:text-wine text-sm sm:text-base mt-3 transition-colors">
                {occ.name}
              </h3>
              <p className="text-[11px] text-muted">{occ.tagline}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
