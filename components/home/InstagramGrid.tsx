import React from "react";
import Image from "next/image";
import { Instagram, ExternalLink } from "lucide-react";

const instaPosts = [
  { img: "/images/products/royal-velvet-anniversary-hamper-1.svg", alt: "Royal velvet luxury hamper packaging" },
  { img: "/images/products/blush-elegance-birthday-hamper-1.svg", alt: "Blush elegance birthday box with candles" },
  { img: "/images/products/golden-festive-diwali-hamper-1.svg", alt: "Festive golden diwali brass diya hamper" },
  { img: "/images/products/celestial-pamper-self-care-hamper-1.svg", alt: "Spa and self care relaxing bath hamper" },
  { img: "/images/products/executive-luxe-corporate-hamper-1.svg", alt: "Corporate executive gift set with pour over coffee" },
  { img: "/images/products/sweet-beginnings-newborn-hamper-1.svg", alt: "Baby shower newborn organic cotton basket" },
];

export function InstagramGrid() {
  const handle = process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || "little_luxehamper";
  const profileUrl = `https://instagram.com/${handle}`;

  return (
    <section className="py-16 bg-white border-t border-blush/60">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-rose-dark font-bold mb-1">
            <Instagram className="w-4 h-4" />
            <span>Join The Hamper Community</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-wine">
            Follow @{handle}
          </h2>
          <p className="text-xs sm:text-sm text-muted mt-2">
            Daily styling reels, packaging secrets, and new seasonal launches on our Instagram feed.
          </p>
          <div className="mt-4">
            <a
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-white text-xs font-semibold shadow-sm transition-all hover:opacity-95"
              style={{
                background: "linear-gradient(45deg, #F58529, #DD2A7B, #8134AF, #515BD4)",
              }}
            >
              <span>View Profile on Instagram</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {instaPosts.map((post, i) => (
            <a
              key={i}
              href={profileUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group relative aspect-square rounded-xl overflow-hidden bg-cream border border-blush/70 shadow-sm"
            >
              <Image
                src={post.img}
                alt={post.alt}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 16vw"
                className="object-cover group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-ink/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                <Instagram className="w-6 h-6 drop-shadow-md" />
              </div>
            </a>
          ))}
        </div>
      </div>
    </section>
  );
}
