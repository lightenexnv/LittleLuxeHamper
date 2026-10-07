import React from "react";
import { Gift, Edit3, Truck } from "lucide-react";

export function HowItWorks() {
  const steps = [
    {
      num: "01",
      title: "Choose or Build",
      desc: "Select a curated aesthetic hamper from our collection or hand-pick bespoke treats in our custom builder.",
      icon: Gift,
    },
    {
      num: "02",
      title: "Personalise Sentiment",
      desc: "Type your heartfelt message. We wax-seal it in calligraphy gold foil paper and schedule your target delivery date.",
      icon: Edit3,
    },
    {
      num: "03",
      title: "Handpacked Pan-India",
      desc: "We hand-tie our signature satin ribbon and dispatch express via tracked couriers to 19,000+ Indian pincodes.",
      icon: Truck,
    },
  ];

  return (
    <section className="py-16 bg-white border-y border-blush/60">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-12">
          <span className="text-xs font-bold text-gold uppercase tracking-widest">
            The Atelier Process
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-wine mt-1">
            How Gifting Works
          </h2>
          <p className="text-xs sm:text-sm text-muted mt-2">
            Seamless gifting from your screen to their hands in three thoughtful steps.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
          {steps.map((s) => {
            const Icon = s.icon;
            return (
              <div
                key={s.num}
                className="relative p-6 sm:p-8 rounded-2xl bg-cream border border-blush/70 flex flex-col items-center text-center group hover:shadow-luxe transition-all duration-300"
              >
                <div className="w-14 h-14 rounded-full bg-blush flex items-center justify-center text-wine mb-5 shadow-sm group-hover:bg-wine group-hover:text-cream transition-colors duration-300">
                  <Icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-serif font-bold text-gold tracking-widest mb-1">
                  STEP {s.num}
                </span>
                <h3 className="font-serif text-xl font-bold text-ink mb-2">
                  {s.title}
                </h3>
                <p className="text-xs sm:text-sm text-muted leading-relaxed font-sans">
                  {s.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
