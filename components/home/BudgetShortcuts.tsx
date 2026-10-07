import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight } from "lucide-react";

const budgetTiers = [
  {
    label: "Pocket Luxury",
    range: "Under ₹999",
    href: "/gifts/under-999",
    desc: "Delightful little tokens and sweet surprises",
  },
  {
    label: "Boutique Favorites",
    range: "Under ₹1,999",
    href: "/gifts/under-1999",
    desc: "Soy candles, teas & artisanal confectionery",
  },
  {
    label: "Grand Celebrations",
    range: "Under ₹2,999",
    href: "/gifts/under-2999",
    desc: "Generous multi-item hampers for birthdays & festivities",
  },
  {
    label: "Heirloom Trousseau",
    range: "₹3,999 & Above",
    href: "/collections/luxury-premiere",
    desc: "Opulent velvet & wooden keepsake chests",
  },
];

export function BudgetShortcuts() {
  return (
    <section className="py-14 bg-cream">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-10">
          <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-gold font-bold mb-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Thoughtful At Every Price</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-wine">
            Shop By Budget
          </h2>
          <p className="text-xs sm:text-sm text-muted mt-1.5">
            Choose your price tier to explore handpacked luxury without guesswork.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {budgetTiers.map((tier) => (
            <Link
              key={tier.range}
              href={tier.href}
              className="group p-6 rounded-card bg-white border border-blush hover:border-gold hover:shadow-luxe transition-all duration-300 flex flex-col justify-between"
            >
              <div>
                <span className="text-xs font-semibold text-rose-dark uppercase tracking-wider">
                  {tier.label}
                </span>
                <h3 className="font-serif text-2xl font-bold text-wine mt-1 group-hover:text-gold-dark transition-colors">
                  {tier.range}
                </h3>
                <p className="text-xs text-muted mt-2 leading-relaxed font-sans">
                  {tier.desc}
                </p>
              </div>

              <div className="mt-6 pt-3 border-t border-blush/40 flex items-center justify-between text-xs font-semibold text-wine group-hover:text-gold-dark">
                <span>Browse Hampers</span>
                <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
