import React from "react";
import { Sparkles, Heart, Gift, Truck } from "lucide-react";

export function MarqueeBand() {
  const items = [
    { text: "HANDPACKED WITH LOVE", icon: Heart },
    { text: "PAN-INDIA EXPRESS DELIVERY", icon: Truck },
    { text: "EVERLASTING ARTISAN FLORALS", icon: Sparkles },
    { text: "BESPOKE ILLUMINATED TRUNKS", icon: Gift },
    { text: "WAX-SEALED CALLIGRAPHY NOTES", icon: Sparkles },
    { text: "100% AUTHENTIC CURATIONS", icon: Heart },
  ];

  const duplicated = [...items, ...items, ...items];

  return (
    <div className="w-full bg-mulberry text-cream py-3.5 overflow-hidden border-y border-gold/30 relative select-none">
      <div className="flex w-max animate-marquee gap-8 items-center font-serif text-xs sm:text-sm tracking-widest uppercase font-semibold text-gold-light will-change-transform">
        {duplicated.map((item, idx) => {
          const Icon = item.icon;
          return (
            <div key={idx} className="flex items-center gap-4 shrink-0">
              <span>{item.text}</span>
              <Icon className="w-3.5 h-3.5 text-gold shrink-0" />
            </div>
          );
        })}
      </div>
    </div>
  );
}
