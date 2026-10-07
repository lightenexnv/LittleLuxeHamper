import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Sparkles, Heart, ShieldCheck, Truck, ArrowRight } from "lucide-react";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "About Little Luxe Hamper | The Indian Gifting Atelier",
  description:
    "Learn about our Bangalore gifting atelier, handpacked silk ribbon craftsmanship, wax seal calligraphy, and commitment to luxury gifting across India.",
  canonicalUrl: "/about",
});

export default function AboutPage() {
  return (
    <div className="bg-cream min-h-screen py-12 sm:py-20">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-gold uppercase tracking-widest flex items-center justify-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Our Atelier Story</span>
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-wine mt-2">
            Where Thoughtfulness Meets Tactile Luxury
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-3 leading-relaxed">
            Founded with a simple mission: to rescue gifting from generic cellophane wrappers and create unboxing moments that leave lasting emotional footprints.
          </p>
        </div>

        {/* Story Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center bg-white rounded-3xl p-6 sm:p-12 border border-blush/80 shadow-luxe mb-16">
          <div className="lg:col-span-6 space-y-4">
            <span className="text-xs font-bold text-rose-dark uppercase tracking-wider">
              The Atelier Philosophy
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-wine">
              Little Gifts, Big Feelings
            </h2>
            <p className="text-xs sm:text-sm text-ink/80 leading-relaxed font-sans">
              In an increasingly fast-paced digital world, receiving a tangible, exquisitely hand-wrapped gift is an irreplaceable human joy. At Little Luxe Hamper, we believe a gift box should delight every single sense before it is even opened.
            </p>
            <p className="text-xs sm:text-sm text-ink/80 leading-relaxed font-sans">
              From the deep burgundy glow of our velvet trunks to the smooth rustle of parchment paper and the faint botanical scent of dried French lavender, every detail is considered with reverence.
            </p>
            <p className="text-xs sm:text-sm text-ink/80 leading-relaxed font-sans">
              Our calligraphers hand-transcribe every personal note, which is then sealed with molten wax and stamped with our signature brass monogram.
            </p>
          </div>

          <div className="lg:col-span-6 relative aspect-[4/3] rounded-2xl overflow-hidden bg-cream shadow-md">
            <Image
              src="/images/hero/luxe-banner.svg"
              alt="Artisanal handpacking studio and luxury gift curation"
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
        </div>

        {/* Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-8 rounded-3xl bg-white border border-blush/80 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-full bg-blush flex items-center justify-center text-wine mx-auto">
              <Heart className="w-6 h-6 text-rose-dark" />
            </div>
            <h3 className="font-serif font-bold text-wine text-xl">Handpacked in India</h3>
            <p className="text-xs text-muted leading-relaxed font-sans">
              Every ribbon is tied by human hands, never machine-glued. We take pride in supporting Indian artisan brass casters, organic tea estates, and local chocolatiers.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-blush/80 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-full bg-blush flex items-center justify-center text-wine mx-auto">
              <ShieldCheck className="w-6 h-6 text-gold" />
            </div>
            <h3 className="font-serif font-bold text-wine text-xl">Zero-Breakage Guarantee</h3>
            <p className="text-xs text-muted leading-relaxed font-sans">
              Rigid 1200 GSM boxes and custom cushioning ensure every porcelain mug, brass diya, and fragile treat arrives in museum-grade perfection.
            </p>
          </div>

          <div className="p-8 rounded-3xl bg-white border border-blush/80 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-full bg-blush flex items-center justify-center text-wine mx-auto">
              <Truck className="w-6 h-6 text-wine" />
            </div>
            <h3 className="font-serif font-bold text-wine text-xl">Pan-India Express</h3>
            <p className="text-xs text-muted leading-relaxed font-sans">
              From Kashmir to Kanyakumari, our express logistics network covers 19,000+ pincodes with real-time SMS tracking updates and target-date delivery.
            </p>
          </div>
        </div>

        {/* CTA */}
        <div className="mt-16 text-center">
          <Link
            href="/shop"
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-pill bg-wine text-cream hover:bg-wine-light font-bold text-sm shadow-luxe transition-all"
          >
            <span>Explore the Collections</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
