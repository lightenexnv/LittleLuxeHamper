import React from "react";
import { PackageCheck, ShieldCheck, Sparkles, MessageCircle } from "lucide-react";

export function WhyUs() {
  const points = [
    {
      title: "Boutique Craftsmanship",
      desc: "Every box is lined with tissue, wrapped in satin, and inspected before closure. No mass assembly lines.",
      icon: Sparkles,
    },
    {
      title: "Wax Seal Calligraphy Notes",
      desc: "We don't print generic receipts. Your personalized greeting is rendered on parchment with a gold wax seal.",
      icon: PackageCheck,
    },
    {
      title: "Breakage-Proof Packaging",
      desc: "Fragile items, ceramics, and brass are cushioned with custom die-cut inserts and rigid 1200 GSM outer boxes.",
      icon: ShieldCheck,
    },
    {
      title: "WhatsApp Personal Concierge",
      desc: "Talk to real human curators for delivery advice, bulk orders, or same-day metro dispatches.",
      icon: MessageCircle,
    },
  ];

  return (
    <section className="py-12 sm:py-16 bg-white border-t border-blush/60">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-8 sm:mb-12">
          <span className="text-[11px] sm:text-xs font-bold text-gold uppercase tracking-widest">
            The Little Luxe Difference
          </span>
          <h2 className="font-serif text-2xl sm:text-4xl font-bold text-wine mt-1">
            Why Discerning Gifters Choose Us
          </h2>
          <p className="text-xs sm:text-sm text-muted mt-1.5 sm:mt-2 px-2">
            Elevating Indian gifting through meticulous attention to detail, tactile luxury, and heartfelt service.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {points.map((p, idx) => {
            const Icon = p.icon;
            return (
              <div
                key={idx}
                className="p-5 sm:p-6 rounded-card bg-cream border border-blush/70 flex flex-col justify-start hover:border-gold hover:shadow-luxe transition-all duration-300"
              >
                <div className="w-10 sm:w-12 h-10 sm:h-12 rounded-xl bg-blush/60 flex items-center justify-center text-wine mb-3 sm:mb-4">
                  <Icon className="w-5 sm:w-6 h-5 sm:h-6" />
                </div>
                <h3 className="font-serif text-base sm:text-lg font-bold text-ink mb-1.5 sm:mb-2">
                  {p.title}
                </h3>
                <p className="text-xs text-muted leading-relaxed font-sans">
                  {p.desc}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
