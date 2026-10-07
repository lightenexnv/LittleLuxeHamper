import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ArrowRight, Heart, Truck, ShieldCheck, Gift } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-cream via-sand/40 to-cream pt-4 pb-14 sm:pt-10 sm:pb-28">
      {/* Subtle paper grain texture */}
      <div className="absolute inset-0 bg-grain opacity-60 pointer-events-none" />

      {/* Decorative ambient color orbs */}
      <div className="absolute top-12 left-1/4 w-72 sm:w-96 h-72 sm:h-96 bg-blush/30 rounded-full blur-3xl pointer-events-none -translate-x-1/2" />
      <div className="absolute bottom-8 right-10 w-60 sm:w-80 h-60 sm:h-80 bg-gold-light/20 rounded-full blur-3xl pointer-events-none" />

      <div className="relative max-w-[1280px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 sm:gap-12 lg:gap-8 items-center">
          {/* Left: Text & Editorial Story */}
          <div className="lg:col-span-6 space-y-4 sm:space-y-6 text-center lg:text-left z-10">
            {/* Atelier Badge */}
            <div className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1 sm:py-1.5 rounded-full bg-white/90 border border-gold/30 text-wine shadow-xs backdrop-blur-sm">
              <Sparkles className="w-3 sm:w-3.5 h-3 sm:h-3.5 text-gold shrink-0 animate-pulse" />
              <span className="text-[11px] sm:text-xs font-semibold tracking-wider uppercase font-sans">
                India&apos;s Boutique Gifting Atelier
              </span>
            </div>

            {/* Confident, oversized headline with italic flair - proportional on mobile */}
            <h1 className="font-serif text-[2.5rem] leading-[1.08] sm:text-6xl xl:text-7xl font-bold text-mulberry tracking-tight">
              Unboxing <br className="hidden sm:inline" />
              <span className="italic font-normal text-rose-dark">Unforgettable</span>{" "}
              <span className="text-wine underline decoration-gold/40 decoration-wavy decoration-1 underline-offset-4 sm:underline-offset-8">
                Love.
              </span>
            </h1>

            <p className="text-sm sm:text-lg text-ink/80 max-w-lg lg:max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans font-normal px-1 sm:px-0">
              Every Little Luxe Hamper is hand-curated with fairy lights, handcrafted everlasting florals, 
              luxe keepsakes, and personalized handwritten cards. Delivered with panache across India.
            </p>

            {/* CTAs with magnetic hover & shimmer - full width finger targets on mobile */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center lg:justify-start gap-3 sm:gap-4 pt-1 sm:pt-2">
              <Link
                href="/shop"
                className="shimmer-btn w-full sm:w-auto px-6 sm:px-8 py-3.5 sm:py-4 rounded-pill bg-wine text-cream hover:bg-wine-light font-semibold text-sm flex items-center justify-center gap-2 sm:gap-2.5 shadow-luxe hover:shadow-luxe-lg transition-all duration-300"
              >
                <Gift className="w-4 h-4 text-gold-light" />
                <span>Explore Curated Hampers</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="https://wa.me/919876543210?text=Hi%20Little%20Luxe%20Hamper!%20I'd%20love%20to%20customize%20a%20bespoke%20gifting%20hamper."
                target="_blank"
                rel="noopener noreferrer"
                className="w-full sm:w-auto px-6 sm:px-7 py-3.5 sm:py-4 rounded-pill border border-gold/50 bg-white/90 hover:bg-blush/40 text-wine font-semibold text-sm text-center shadow-xs transition-all duration-200"
              >
                Custom Order on WhatsApp ↗
              </Link>
            </div>

            {/* Trust Chips */}
            <div className="pt-3 sm:pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-7 text-[11px] sm:text-xs text-muted font-medium border-t border-blush/50">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Truck className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-wine shrink-0" />
                <span>Express Pan-India Delivery</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <Heart className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-rose-dark shrink-0" />
                <span>100% Handpacked &amp; Sealed</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <ShieldCheck className="w-3.5 sm:w-4 h-3.5 sm:h-4 text-gold-dark shrink-0" />
                <span>Verified Handcrafted Quality</span>
              </div>
            </div>
          </div>

          {/* Right: Real Photography Collage in Staggered Arch & Rounded Frames */}
          <div className="lg:col-span-6 relative flex items-center justify-center">
            {/* Background Decorative Rings */}
            <div className="absolute w-72 h-72 sm:w-96 sm:h-96 rounded-full border border-gold/20 -top-6 -right-6 pointer-events-none" />
            <div className="absolute w-60 h-60 sm:w-80 sm:h-80 rounded-full border border-rose-light/30 bottom-2 left-4 pointer-events-none" />

            <div className="relative w-full max-w-[540px] grid grid-cols-12 gap-3 sm:gap-4 p-2">
              {/* Main Primary Image (Only Priority LCP image) */}
              <div className="col-span-8 relative aspect-[4/5] rounded-[24px] overflow-hidden shadow-luxe-lg border-2 border-white bg-sand/30 transform transition-transform duration-500 hover:scale-[1.02]">
                <Image
                  src="/media/images/3954806144118936893_25237603949.webp"
                  alt="Royal illuminated celebration trunk with fairy lights and silver rakhis by Little Luxe Hamper"
                  fill
                  priority
                  sizes="(max-width: 1024px) 70vw, 35vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />
                <div className="absolute bottom-3 left-3 right-3 text-white">
                  <span className="inline-block px-2.5 py-0.5 rounded-full bg-black/50 backdrop-blur-sm text-[10px] font-semibold text-gold-light uppercase tracking-wider mb-1">
                    Signature Keepsake
                  </span>
                  <p className="font-serif text-sm sm:text-base font-semibold drop-shadow-sm line-clamp-1">
                    Royal Illuminated Celebration Trunk
                  </p>
                </div>
              </div>

              {/* Staggered Secondary Arch & Vertical Cards */}
              <div className="col-span-4 flex flex-col gap-3 sm:gap-4 justify-between">
                {/* Bouquet photo in arch mask */}
                <div className="relative aspect-[3/4] rounded-t-[40px] rounded-b-[18px] overflow-hidden shadow-luxe border-2 border-white bg-sand/30 transform transition-transform duration-500 hover:scale-[1.03]">
                  <Image
                    src="/media/images/3944067240609796323_23802205442.webp"
                    alt="Handcrafted pastel pipe-cleaner floral bouquet with pearl ribbon by Little Luxe Hamper"
                    fill
                    sizes="(max-width: 1024px) 30vw, 15vw"
                    className="object-cover"
                  />
                  <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-white/90 text-[9px] font-bold text-wine shadow-xs">
                    Bouquet
                  </div>
                </div>

                {/* Third celebration photo */}
                <div className="relative aspect-square rounded-[20px] overflow-hidden shadow-luxe border-2 border-white bg-sand/30 transform transition-transform duration-500 hover:scale-[1.03]">
                  <Image
                    src="/media/images/3971308063021843388_25237603949_1.webp"
                    alt="Illuminated birthday trunk with bunting and jewellery by Little Luxe Hamper"
                    fill
                    sizes="(max-width: 1024px) 30vw, 15vw"
                    className="object-cover"
                  />
                </div>
              </div>

              {/* Floating Instagram Follower Tag - Positioned safely on mobile without blocking buttons */}
              <div className="absolute -bottom-5 left-4 sm:left-10 bg-white/95 backdrop-blur-md px-3.5 py-2 sm:py-2.5 rounded-2xl shadow-luxe border border-gold/30 flex items-center gap-2.5 sm:gap-3 z-20">
                <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-gradient-to-tr from-gold to-rose flex items-center justify-center text-white shrink-0 shadow-sm">
                  <Sparkles className="w-3.5 sm:w-4 h-3.5 sm:h-4" />
                </div>
                <div className="text-left">
                  <p className="font-serif font-bold text-wine text-xs sm:text-sm leading-tight">
                    @little_luxehamper
                  </p>
                  <p className="text-[9px] sm:text-[10px] text-muted">Real client unboxings &amp; stories</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
