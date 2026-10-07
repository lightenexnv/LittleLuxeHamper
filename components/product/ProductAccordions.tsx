"use client";

import React, { useState } from "react";
import { ChevronDown, CheckCircle2, Package, Sparkles, RefreshCcw } from "lucide-react";

export function ProductAccordions({
  contents,
  sku,
}: {
  contents: string[];
  sku: string;
}) {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    contents: true,
    packaging: false,
    delivery: false,
    returns: false,
  });

  const toggle = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  return (
    <div className="space-y-2 pt-6 border-t border-blush/80">
      {/* 1. What's Inside */}
      <div className="border border-blush/60 rounded-xl overflow-hidden bg-white">
        <button
          onClick={() => toggle("contents")}
          className="w-full p-4 text-left flex items-center justify-between font-serif font-bold text-wine text-base"
        >
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-gold" />
            <span>What&apos;s Inside This Hamper</span>
          </div>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${openSections.contents ? "rotate-180" : ""}`}
          />
        </button>
        {openSections.contents && (
          <div className="px-4 pb-4 pt-1 border-t border-blush/30">
            <ul className="space-y-2 text-xs sm:text-sm text-ink/80 font-sans">
              {contents.map((item, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-gold shrink-0 mt-0.5" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* 2. Packaging & Craftsmanship */}
      <div className="border border-blush/60 rounded-xl overflow-hidden bg-white">
        <button
          onClick={() => toggle("packaging")}
          className="w-full p-4 text-left flex items-center justify-between font-serif font-bold text-wine text-base"
        >
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-gold" />
            <span>Bespoke Packaging & Ribbon Details</span>
          </div>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${openSections.packaging ? "rotate-180" : ""}`}
          />
        </button>
        {openSections.packaging && (
          <div className="px-4 pb-4 pt-1 border-t border-blush/30 text-xs sm:text-sm text-ink/80 space-y-2 leading-relaxed">
            <p>
              Each gift is housed in our signature 1200 GSM rigid keepsake box, tied by hand with a 2-inch double-faced satin ribbon and stamped with a vintage brass wax seal monogram.
            </p>
            <p className="text-[11px] text-muted">SKU: {sku}</p>
          </div>
        )}
      </div>

      {/* 3. Delivery & Handling */}
      <div className="border border-blush/60 rounded-xl overflow-hidden bg-white">
        <button
          onClick={() => toggle("delivery")}
          className="w-full p-4 text-left flex items-center justify-between font-serif font-bold text-wine text-base"
        >
          <div className="flex items-center gap-2">
            <Package className="w-4 h-4 text-gold" />
            <span>Pan-India Shipping Timelines</span>
          </div>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${openSections.delivery ? "rotate-180" : ""}`}
          />
        </button>
        {openSections.delivery && (
          <div className="px-4 pb-4 pt-1 border-t border-blush/30 text-xs sm:text-sm text-ink/80 space-y-2 leading-relaxed">
            <p>
              &bull; <strong>Bengaluru Atelier Origin:</strong> 1 business day express.
            </p>
            <p>
              &bull; <strong>Metro Hubs (Delhi, Mumbai, Hyd, Chennai, Pune):</strong> 2 to 3 business days.
            </p>
            <p>
              &bull; <strong>All Other Pincodes:</strong> 3 to 5 business days with tracked express couriers.
            </p>
          </div>
        )}
      </div>

      {/* 4. Replacements & Guarantee */}
      <div className="border border-blush/60 rounded-xl overflow-hidden bg-white">
        <button
          onClick={() => toggle("returns")}
          className="w-full p-4 text-left flex items-center justify-between font-serif font-bold text-wine text-base"
        >
          <div className="flex items-center gap-2">
            <RefreshCcw className="w-4 h-4 text-gold" />
            <span>Zero-Breakage Guarantee</span>
          </div>
          <ChevronDown
            className={`w-4 h-4 transition-transform ${openSections.returns ? "rotate-180" : ""}`}
          />
        </button>
        {openSections.returns && (
          <div className="px-4 pb-4 pt-1 border-t border-blush/30 text-xs sm:text-sm text-ink/80 leading-relaxed">
            <p>
              Due to the bespoke perishable nature of gift hampers, returns are not accepted. However, if any item is damaged in transit, we provide an immediate 100% free replacement or refund upon photo verification within 24 hours of delivery.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
