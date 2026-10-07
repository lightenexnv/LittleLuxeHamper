import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { ProductCard } from "@/components/ui/ProductCard";
import { FaqAccordion } from "@/components/home/FaqAccordion";
import { constructMetadata, generateBreadcrumbJsonLd } from "@/lib/seo";

interface CollectionPageProps {
  params: {
    slug: string;
  };
}

export const revalidate = 300;

export async function generateStaticParams() {
  const collections = await db.collection.findMany({ select: { slug: true } });
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({
  params,
}: CollectionPageProps): Promise<Metadata> {
  const col = await db.collection.findUnique({
    where: { slug: params.slug },
  });

  if (!col) return {};

  return constructMetadata({
    title: `${col.name} Gift Hampers | Little Luxe Hamper`,
    description: col.intro.slice(0, 155),
    canonicalUrl: `/collections/${col.slug}`,
  });
}

export default async function CollectionPage({ params }: CollectionPageProps) {
  const col = await db.collection.findUnique({
    where: { slug: params.slug },
    include: {
      products: {
        where: { isActive: true },
        include: {
          images: { orderBy: { sort: "asc" } },
        },
      },
    },
  });

  if (!col) notFound();

  const breadcrumbs = generateBreadcrumbJsonLd([
    { name: "Home", item: "/" },
    { name: "Collections", item: "/shop" },
    { name: col.name, item: `/collections/${col.slug}` },
  ]);

  return (
    <div className="bg-cream min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      {/* Banner */}
      <div className="bg-white border-b border-blush/60 py-12 text-center">
        <div className="max-w-[1240px] mx-auto px-4">
          <span className="text-xs font-bold text-gold uppercase tracking-widest">
            Curated Gifting
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-wine mt-1">
            {col.name}
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-3 max-w-xl mx-auto leading-relaxed">
            {col.intro}
          </p>
        </div>
      </div>

      {/* Grid */}
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-12">
        <div className="mb-6 text-xs text-muted">
          Showing {col.products.length} bespoke curations in {col.name}
        </div>

        {col.products.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-blush/80">
            <p className="font-serif text-xl font-bold text-wine">
              New curations arriving soon for {col.name}
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {col.products.map((p) => (
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
