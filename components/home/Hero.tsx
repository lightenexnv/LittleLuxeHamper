import React from "react";
import Image from "next/image";
import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Heart, Truck } from "lucide-react";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-white via-cream to-cream pt-8 pb-16 sm:pb-24">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-8 items-center">
          {/* Text Content */}
          <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blush/60 border border-blush text-wine text-xs font-semibold tracking-wide">
              <Sparkles className="w-3.5 h-3.5 text-gold shrink-0" />
              <span>Pan-India Luxury Gifting Atelier</span>
            </div>

            <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-bold text-wine leading-[1.12]">
              Little Gifts, <br />
              <span className="italic font-normal text-gold-dark">Big Feelings.</span>
            </h1>

            <p className="text-base sm:text-lg text-ink/80 max-w-xl mx-auto lg:mx-0 leading-relaxed font-sans">
              Hand-curated, ribbon-tied bespoke hampers crafted to create unforgettable unboxing
              memories for birthdays, anniversaries, weddings, and celebrations across India.
            </p>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3.5 pt-2">
              <Link
                href="/shop"
                className="w-full sm:w-auto px-8 py-3.5 rounded-pill bg-wine text-cream hover:bg-wine-light font-medium text-sm flex items-center justify-center gap-2 shadow-luxe hover:shadow-luxe-lg transition-all"
              >
                <span>Shop All Hampers</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <Link
                href="/build-your-hamper"
                className="w-full sm:w-auto px-8 py-3.5 rounded-pill border border-gold text-wine hover:bg-blush/30 font-medium text-sm text-center transition-colors"
              >
                Build Your Own Box
              </Link>
            </div>

            {/* Trust Chips */}
            <div className="pt-4 flex flex-wrap items-center justify-center lg:justify-start gap-4 sm:gap-6 text-xs text-muted font-medium">
              <div className="flex items-center gap-1.5">
                <Truck className="w-4 h-4 text-wine" />
                <span>Pan-India Delivery</span>
              </div>
              <div className="flex items-center gap-1.5">
                <Heart className="w-4 h-4 text-rose-dark" />
                <span>Handpacked with Love</span>
              </div>
              <div className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-gold-dark" />
                <span>Secure Payments</span>
              </div>
            </div>
          </div>

          {/* LCP Priority Hero Image */}
          <div className="lg:col-span-5 relative">
            <div className="relative aspect-[4/3] sm:aspect-[16/11] lg:aspect-[4/5] rounded-3xl overflow-hidden shadow-2xl border-4 border-white/80 bg-blush/20">
              <Image
                src="/images/hero/luxe-banner.svg"
                alt="Little Luxe Hamper signature artisanal gift box with hand-tied satin ribbon"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
            </div>

            {/* Floating Luxury Accent Tag */}
            <div className="absolute -bottom-4 -left-3 sm:left-4 bg-white/95 backdrop-blur-md p-3.5 rounded-2xl shadow-luxe border border-blush/80 flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blush/50 flex items-center justify-center text-wine">
                <Sparkles className="w-5 h-5 text-gold" />
              </div>
              <div className="text-left">
                <p className="font-serif font-bold text-wine text-sm">Signature Satin Bow</p>
                <p className="text-[11px] text-muted">Wax-sealed calligraphy letter included</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
