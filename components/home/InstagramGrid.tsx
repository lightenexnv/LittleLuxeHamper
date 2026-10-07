"use client";

import React from "react";
import Image from "next/image";
import { Instagram, ExternalLink } from "lucide-react";
import { trackInstagramClick } from "@/lib/analytics";

const realInstaPosts = [
  {
    img: "/media/images/3944067240609796323_23802205442.webp",
    alt: "Handcrafted pipe-cleaner floral bloom bouquet with pearl ribbon by Little Luxe Hamper",
    url: "https://www.instagram.com/p/Da8JEI-zVDj/",
  },
  {
    img: "/media/images/3954806144118936893_25237603949.webp",
    alt: "Illuminated luxury Raksha Bandhan Bhai & Bhabhi keepsake trunk",
    url: "https://www.instagram.com/p/DbiSzwPvdU9/",
  },
  {
    img: "/media/images/3971308063021843388_25237603949_1.webp",
    alt: "Pastel pink birthday celebration trunk with bunting and jewellery",
    url: "https://www.instagram.com/p/Dcc66R2D8O8/",
  },
  {
    img: "/media/images/3981723450503017365_23802205442_1.webp",
    alt: "Eternal velvet rose luxury bouquet in mocha wrap",
    url: "https://www.instagram.com/little_luxehamper/",
  },
  {
    img: "/media/images/3988244139536006049_23802205442_1.webp",
    alt: "Monochrome plush panda & crochet floral bouquet",
    url: "https://www.instagram.com/little_luxehamper/",
  },
  {
    img: "/media/images/4000538639129881934_25237603949_1.webp",
    alt: "Gentleman's signature Polo Ralph Lauren & CK illuminated trunk",
    url: "https://www.instagram.com/little_luxehamper/",
  },
];

export function InstagramGrid() {
  const handle = process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || "little_luxehamper";
  const profileUrl = `https://instagram.com/${handle}`;

  return (
    <section className="py-12 sm:py-20 bg-white border-t border-blush/60 relative">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs uppercase tracking-widest text-rose-dark font-bold mb-2">
            <Instagram className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
            <span>Join Our Gifting Community</span>
          </div>
          <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-mulberry tracking-tight">
            Follow @{handle}
          </h2>
          <p className="text-xs sm:text-sm text-muted mt-1.5 sm:mt-2 font-sans px-2">
            Behind-the-scenes hamper styling, bespoke customer stories, and unboxing reveals.
          </p>
          <div className="mt-4 sm:mt-5">
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackInstagramClick("profile_link", "instagram_grid_header")}
              className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-white text-xs font-semibold shadow-md transition-all hover:opacity-95 transform hover:-translate-y-0.5"
              style={{
                background: "linear-gradient(45deg, #F58529, #DD2A7B, #8134AF, #515BD4)",
              }}
            >
              <span>Follow On Instagram ↗</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* 6-Column Responsive Masonry/Grid of Real Instagram Posts */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3 sm:gap-4">
          {realInstaPosts.map((post, i) => (
            <a
              key={i}
              href={post.url}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackInstagramClick(post.url, "instagram_grid_tile")}
              className="group relative aspect-square rounded-2xl overflow-hidden bg-sand/30 border border-blush/80 shadow-sm hover:shadow-luxe transition-all duration-300"
            >
              <Image
                src={post.img}
                alt={post.alt}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                className="object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
              />
              <div className="absolute inset-0 bg-black/45 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center text-white p-2">
                <Instagram className="w-6 h-6 mb-1 drop-shadow-md transform scale-90 group-hover:scale-100 transition-transform" />
                <span className="text-[10px] font-semibold text-center drop-shadow-sm">
                  View on Instagram ↗
                </span>
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
