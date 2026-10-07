"use client";

import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { defaultFaqs, FaqItem } from "@/lib/faqs";

export { defaultFaqs };
export type { FaqItem };

export function FaqAccordion({ faqs = defaultFaqs }: { faqs?: FaqItem[] }) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (idx: number) => {
    setOpenIndex(openIndex === idx ? null : idx);
  };

  return (
    <section className="py-16 bg-cream border-t border-blush/60">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-gold uppercase tracking-widest">
            Common Questions
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-bold text-wine mt-1">
            Frequently Asked Questions
          </h2>
          <p className="text-xs sm:text-sm text-muted mt-2">
            Everything you need to know about ordering, delivery dates, and our gift packaging.
          </p>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="rounded-2xl bg-white border border-blush/80 overflow-hidden shadow-sm transition-all"
              >
                <button
                  onClick={() => toggle(idx)}
                  className="w-full p-5 text-left flex items-center justify-between gap-4 focus:outline-none"
                  aria-expanded={isOpen}
                >
                  <span className="font-serif font-bold text-ink text-base sm:text-lg">
                    {faq.question}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-wine shrink-0 transition-transform duration-300 ${
                      isOpen ? "rotate-180 text-gold" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-5 pb-5 pt-0 text-xs sm:text-sm text-ink/80 leading-relaxed font-sans border-t border-blush/30 pt-3">
                    {faq.answer}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
