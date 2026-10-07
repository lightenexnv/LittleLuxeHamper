import React, { Suspense } from "react";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { ShopContainer } from "@/components/shop/ShopContainer";
import { constructMetadata } from "@/lib/seo";

export const revalidate = 300;

export const metadata: Metadata = constructMetadata({
  title: "Shop All Luxury Gift Hampers | Little Luxe Hamper India",
  description:
    "Explore our complete range of bespoke gift hampers. Filter by occasion, budget, or custom options with express pan-India delivery.",
  canonicalUrl: "/shop",
});

export default async function ShopPage() {
  const products = await db.product.findMany({
    where: { isActive: true },
    include: {
      images: { orderBy: { sort: "asc" } },
      collections: { select: { slug: true, name: true } },
    },
    orderBy: { createdAt: "desc" },
  });

  const collections = await db.collection.findMany({
    orderBy: { sort: "asc" },
  });

  return (
    <div className="bg-cream min-h-screen">
      {/* Shop Header Banner */}
      <div className="bg-white border-b border-blush/60 py-10 text-center">
        <div className="max-w-[1240px] mx-auto px-4">
          <span className="text-xs font-bold text-gold uppercase tracking-widest">
            Handpacked With Care
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-wine mt-1">
            Our Hamper Collection
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-2 max-w-lg mx-auto">
            Discover artisanal gift sets adorned with double-faced silk ribbons, wax seals, and curated gourmet delights.
          </p>
        </div>
      </div>

      <Suspense
        fallback={
          <div className="max-w-[1240px] mx-auto px-4 py-20 text-center text-muted">
            <div className="animate-spin w-8 h-8 border-2 border-wine border-t-transparent rounded-full mx-auto mb-3" />
            <p className="text-sm font-medium">Curating luxury hampers...</p>
          </div>
        }
      >
        <ShopContainer products={products} collections={collections} />
      </Suspense>
    </div>
  );
}
