import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, ArrowRight, Check } from "lucide-react";

export function CustomHamperBanner() {
  return (
    <section className="py-12 sm:py-16 bg-cream">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-r from-wine to-wine-dark rounded-3xl overflow-hidden shadow-2xl text-cream grid grid-cols-1 lg:grid-cols-12 items-center">
          <div className="lg:col-span-7 p-6 sm:p-12 space-y-4 sm:space-y-6">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/10 text-gold text-[11px] sm:text-xs font-semibold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Tailored To Perfection</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold leading-tight">
              Build Your Own Bespoke Hamper
            </h2>

            <p className="text-xs sm:text-base text-cream/80 max-w-lg leading-relaxed font-sans">
              Want a signature combination? Choose your gift box style, hand-select artisanal
              treats, add a scented candle, and draft your handwritten note. We calculate the price
              live in 3 simple steps.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-xs text-cream/90 font-medium">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-gold shrink-0" />
                <span>Choice of 4 luxury box finishes</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-gold shrink-0" />
                <span>Hand-tied double-faced silk ribbon</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-gold shrink-0" />
                <span>Real-time price updating</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-gold shrink-0" />
                <span>Pan-India express delivery</span>
              </div>
            </div>

            <div className="pt-2">
              <Link
                href="/build-your-hamper"
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-8 py-3.5 rounded-pill bg-gold hover:bg-gold-light text-ink font-bold text-sm shadow-md transition-all hover:scale-105"
              >
                <span>Launch Hamper Builder</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          <div className="lg:col-span-5 relative h-60 sm:h-96 lg:h-full min-h-[240px] sm:min-h-[320px] bg-wine-dark/40">
            <Image
              src="/media/images/3954806144118936893_25237603949.webp"
              alt="Custom luxury gift hamper styling showcase by Little Luxe Hamper"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover opacity-95 hover:opacity-100 transition-opacity"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
