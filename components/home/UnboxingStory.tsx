"use client";

import React, { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Sparkles, Gift, Edit3, PackageCheck, Send } from "lucide-react";

interface Step {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  image: string;
  alt: string;
  icon: React.ElementType;
}

const steps: Step[] = [
  {
    id: 1,
    title: "Choose the Expression",
    subtitle: "Select or Custom-Build",
    description: "Explore our curated keepsake collections or hand-pick bespoke treasures, from everlasting artisan bouquets to illuminated rigid trunks.",
    image: "/media/images/3954806144118936893_25237603949.webp",
    alt: "Little Luxe Hamper bespoke celebration box",
    icon: Gift,
  },
  {
    id: 2,
    title: "Personalise Every Sentiment",
    subtitle: "Fairy Lights & Handwritten Notes",
    description: "Choose warm micro-fairy lights, custom celebration bunting, and your personal heartfelt message sealed in our gold-wax crested envelope.",
    image: "/media/images/3971308063021843388_25237603949_1.webp",
    alt: "Personalised illuminated hamper with custom bunting",
    icon: Edit3,
  },
  {
    id: 3,
    title: "Artisanal Handpacking",
    subtitle: "Ribbons, Wax Seals & Fragrance",
    description: "Our atelier carefully hand-ties signature satin ribbons, arranges eternal blossoms, and cushions every fragile luxury with archival tissue.",
    image: "/media/images/3944067240609796323_23802205442.webp",
    alt: "Artisan wax-sealed handcrafted bouquet",
    icon: PackageCheck,
  },
  {
    id: 4,
    title: "Delivered Pan-India with Panache",
    subtitle: "Tracked Express Doorstep Dispatch",
    description: "Handed over to verified express courier partners, reaching 19,000+ Indian PIN codes right on their milestone date.",
    image: "/media/images/4000538639129881934_25237603949_1.webp",
    alt: "Signature gentleman luxury birthday trunk ready for gifting",
    icon: Send,
  },
];

export function UnboxingStory() {
  const [activeStep, setActiveStep] = useState(0);
  const stepRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY + window.innerHeight / 2;
      stepRefs.current.forEach((el, index) => {
        if (!el) return;
        const top = el.offsetTop;
        const height = el.offsetHeight;
        if (scrollPosition >= top && scrollPosition < top + height) {
          setActiveStep(index);
        }
      });
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <section className="py-24 bg-gradient-to-b from-cream via-sand/20 to-cream border-y border-blush/60 relative">
      <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
        {/* Section Header */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white border border-gold/40 text-wine text-xs font-semibold uppercase tracking-widest mb-3 shadow-xs">
            <Sparkles className="w-3.5 h-3.5 text-gold" />
            <span>The Unboxing Ritual</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-bold text-mulberry tracking-tight">
            How Every Little Luxe Box Comes to Life
          </h2>
          <p className="text-sm sm:text-base text-muted mt-2 font-sans">
            A seamless journey of craftsmanship from our atelier in India straight to their doorstep.
          </p>
        </div>

        {/* Two-Column Scroll Story: Left Sticky Preview, Right Scrolling Steps */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          {/* Sticky Visual Showcase (Desktop) */}
          <div className="lg:col-span-6 sticky top-28 hidden lg:block">
            <div className="relative aspect-[4/5] rounded-[28px] overflow-hidden shadow-luxe-lg border-4 border-white bg-sand/40">
              {steps.map((s, idx) => (
                <div
                  key={s.id}
                  className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
                    activeStep === idx ? "opacity-100 z-10" : "opacity-0 z-0"
                  }`}
                >
                  <Image
                    src={s.image}
                    alt={s.alt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 45vw"
                    className="object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent pointer-events-none" />
                  <div className="absolute bottom-6 left-6 right-6 text-white z-20">
                    <span className="inline-block px-3 py-1 rounded-full bg-white/20 backdrop-blur-md text-[11px] font-semibold text-gold-light uppercase tracking-wider mb-1.5">
                      Step 0{s.id} • {s.subtitle}
                    </span>
                    <p className="font-serif text-xl font-bold drop-shadow-sm">
                      {s.title}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Scrolling Steps */}
          <div className="lg:col-span-6 space-y-12 sm:space-y-20 py-4">
            {steps.map((s, idx) => {
              const Icon = s.icon;
              const isActive = activeStep === idx;
              return (
                <div
                  key={s.id}
                  ref={(el) => {
                    stepRefs.current[idx] = el;
                  }}
                  className={`p-6 sm:p-8 rounded-gift transition-all duration-500 border ${
                    isActive
                      ? "bg-white shadow-luxe-lg border-gold/40 scale-[1.02]"
                      : "bg-white/60 shadow-sm border-blush/60 opacity-80"
                  }`}
                >
                  {/* Mobile Preview Image */}
                  <div className="relative aspect-[16/10] rounded-2xl overflow-hidden mb-6 lg:hidden shadow-sm">
                    <Image
                      src={s.image}
                      alt={s.alt}
                      fill
                      sizes="100vw"
                      className="object-cover"
                    />
                  </div>

                  <div className="flex items-center gap-4 mb-4">
                    <div
                      className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 ${
                        isActive
                          ? "bg-wine text-white shadow-sm"
                          : "bg-blush/60 text-wine"
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-xs font-serif font-bold text-gold tracking-widest block">
                        PHASE 0{s.id}
                      </span>
                      <h3 className="font-serif text-xl sm:text-2xl font-bold text-mulberry">
                        {s.title}
                      </h3>
                    </div>
                  </div>

                  <p className="text-sm text-ink/80 leading-relaxed font-sans mb-3">
                    {s.description}
                  </p>

                  <div className="text-xs font-semibold text-rose-dark tracking-wide">
                    ✓ {s.subtitle}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
