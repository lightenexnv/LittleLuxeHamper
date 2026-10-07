import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { ProductCard } from "@/components/ui/ProductCard";
import { FaqAccordion } from "@/components/home/FaqAccordion";
import { constructMetadata, generateBreadcrumbJsonLd } from "@/lib/seo";

interface BudgetPageProps {
  params: {
    amount: string;
  };
}

export const revalidate = 300;

const budgetTiers: Record<string, { maxPaise: number; title: string; desc: string }> = {
  "999": {
    maxPaise: 99900,
    title: "Best Luxury Gift Hampers Under ₹999",
    desc: "Thoughtful pocket luxury gifts that impress without high cost. Handpacked with our signature ribbon and complimentary calligraphy note card.",
  },
  "1999": {
    maxPaise: 199900,
    title: "Curated Gift Hampers Under ₹1,999",
    desc: "Our most popular sweet spot! Featuring scented soy wax candles, artisanal teas, and gourmet treats delivered across India.",
  },
  "2999": {
    maxPaise: 299900,
    title: "Premium Gift Hampers Under ₹2,999",
    desc: "Generous multi-item hampers for birthdays, anniversaries, and Diwali with brass keepsakes and Belgian chocolates.",
  },
};

export async function generateStaticParams() {
  return ["999", "1999", "2999"].map((amount) => ({ amount }));
}

export async function generateMetadata({ params }: BudgetPageProps): Promise<Metadata> {
  const tier = budgetTiers[params.amount];
  if (!tier) return {};

  return constructMetadata({
    title: `${tier.title} | Little Luxe Hamper`,
    description: tier.desc.slice(0, 155),
    canonicalUrl: `/gifts/under-${params.amount}`,
  });
}

export default async function BudgetGiftsPage({ params }: BudgetPageProps) {
  const tier = budgetTiers[params.amount];
  if (!tier) notFound();

  const products = await db.product.findMany({
    where: {
      isActive: true,
      pricePaise: { lte: tier.maxPaise },
    },
    include: {
      images: { orderBy: { sort: "asc" } },
    },
    orderBy: { pricePaise: "desc" },
  });

  const breadcrumbs = generateBreadcrumbJsonLd([
    { name: "Home", item: "/" },
    { name: "Gifts", item: "/shop" },
    { name: tier.title, item: `/gifts/under-${params.amount}` },
  ]);

  return (
    <div className="bg-cream min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <div className="bg-white border-b border-blush/60 py-12 text-center">
        <div className="max-w-[1240px] mx-auto px-4">
          <span className="text-xs font-bold text-gold uppercase tracking-widest">
            Boutique Budget Curation
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-wine mt-1">
            {tier.title}
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-3 max-w-xl mx-auto leading-relaxed">
            {tier.desc}
          </p>
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-12">
        <div className="mb-6 text-xs text-muted">
          Showing {products.length} hampers under ₹{params.amount}
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-blush/80">
            <p className="font-serif text-xl font-bold text-wine">
              No hampers found in this price tier.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {products.map((p) => (
              <ProductCard
                key={p.id}
                id={p.id}
                slug={p.slug}
                name={p.name}
                pricePaise={p.pricePaise}
                mrpPaise={p.mrpPaise}
                isSample={p.isSample}
                images={p.images}
              />
            ))}
          </div>
        )}
      </div>

      <FaqAccordion />
    </div>
  );
}
