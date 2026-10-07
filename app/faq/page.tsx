import React from "react";
import type { Metadata } from "next";
import { FaqAccordion } from "@/components/home/FaqAccordion";
import { defaultFaqs } from "@/lib/faqs";
import { constructMetadata, generateFaqJsonLd, generateBreadcrumbJsonLd } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Frequently Asked Questions | Little Luxe Hamper",
  description:
    "Find answers to common questions about pan-India shipping timelines, target delivery dates, gift notes, GST invoicing, and custom hampers.",
  canonicalUrl: "/faq",
});

const allFaqs = [
  ...defaultFaqs,
  {
    question: "Do you offer same-day delivery in Bengaluru?",
    answer:
      "Yes! For orders within Bengaluru placed before 1:00 PM, hyperlocal priority dispatch is available through Borzo/Porter at actual courier charges. Please contact our WhatsApp concierge to arrange same-day delivery.",
  },
  {
    question: "Can I ship hampers to multiple addresses in one corporate order?",
    answer:
      "Absolutely. For orders of 10 or more hampers, you can simply send us an Excel sheet with your recipients' names, addresses, contact numbers, and customized message notes. We provide individual tracking links for every destination.",
  },
  {
    question: "Do hampers include fresh flowers or alcohol?",
    answer:
      "No. To ensure 100% compliance with interstate courier shipping and state excise regulations across India, we do not ship alcoholic beverages or perishable cut flowers nationwide. We use preserved botanicals, scented wax tablets, and luxury artisanal confectionery.",
  },
  {
    question: "Can I get a tax invoice with our company GST number?",
    answer:
      "Yes. Simply check the 'GSTIN' option at checkout and enter your 15-character corporate GSTIN. We automatically issue a GST tax invoice with appropriate HSN breakdowns.",
  },
];

export default function FaqPage() {
  const faqJsonLd = generateFaqJsonLd(allFaqs);
  const breadcrumbJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", item: "/" },
    { name: "FAQ", item: "/faq" },
  ]);

  return (
    <div className="bg-cream min-h-screen py-12 sm:py-20">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbJsonLd) }}
      />

      <div className="max-w-[800px] mx-auto px-4 sm:px-6">
        <FaqAccordion faqs={allFaqs} />
      </div>
    </div>
  );
}
