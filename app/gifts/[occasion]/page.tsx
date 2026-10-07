import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { db } from "@/lib/db";
import { ProductCard } from "@/components/ui/ProductCard";
import { FaqAccordion } from "@/components/home/FaqAccordion";
import { constructMetadata, generateBreadcrumbJsonLd } from "@/lib/seo";

interface GiftOccasionPageProps {
  params: {
    occasion: string;
  };
}

export const revalidate = 300;

const occasionDetails: Record<
  string,
  { title: string; subtitle: string; desc: string; tagKeyword: string }
> = {
  diwali: {
    title: "Diwali Gift Hampers Online India",
    subtitle: "Auspicious Festivities & Pure Brass Diyas",
    desc: "Celebrate the divine festival of lights with opulent Diwali gift hampers. Handpacked with pure brass lotus diyas, roasted Kashmiri dry fruits, saffron almond brittle, and custom gold wax seal greeting cards.",
    tagKeyword: "diwali",
  },
  birthday: {
    title: "Birthday Gift Hampers For Her & Him",
    subtitle: "Joyful Unboxing Surprises Across India",
    desc: "Make birthdays truly unforgettable with ribbon-tied boutique hampers. Featuring handcrafted soy wax candles, Belgian chocolate pralines, and personalized keepsakes delivered express.",
    tagKeyword: "birthday",
  },
  anniversary: {
    title: "Anniversary & Romance Gift Hampers",
    subtitle: "Milestones of Love & Enduring Elegance",
    desc: "Express timeless romance with our signature velvet trunks, gourmet dark chocolates, scented relaxation essentials, and handwritten gold foil calligraphy letters.",
    tagKeyword: "anniversary",
  },
  wedding: {
    title: "Wedding Trousseau & Return Gift Hampers",
    subtitle: "Heirloom Keepsake Chests for Special Guests",
    desc: "Opulent wedding return gifts and bridal trousseau hampers crafted with raw silk, hand-hammered brass katoris, and gourmet provisions. Pan-India venue delivery.",
    tagKeyword: "wedding",
  },
  corporate: {
    title: "Corporate & Executive Gift Hampers",
    subtitle: "Distinguished Gifting for Clients & Teams",
    desc: "High-grade corporate hampers featuring single-origin pour-over coffee, leatherbound journals, thermal mugs, and company branding with GST invoices.",
    tagKeyword: "corporate",
  },
};

export async function generateStaticParams() {
  return Object.keys(occasionDetails).map((key) => ({ occasion: key }));
}

export async function generateMetadata({
  params,
}: GiftOccasionPageProps): Promise<Metadata> {
  const occ = occasionDetails[params.occasion.toLowerCase()];
  if (!occ) return {};

  return constructMetadata({
    title: `${occ.title} | Little Luxe Hamper`,
    description: occ.desc.slice(0, 155),
    canonicalUrl: `/gifts/${params.occasion}`,
  });
}

export default async function GiftOccasionPage({ params }: GiftOccasionPageProps) {
  const occ = occasionDetails[params.occasion.toLowerCase()];
  if (!occ) notFound();

  // Search products by tag or collection
  const products = await db.product.findMany({
    where: {
      isActive: true,
      tags: { contains: occ.tagKeyword },
    },
    include: {
      images: { orderBy: { sort: "asc" } },
    },
    take: 12,
  });

  const breadcrumbs = generateBreadcrumbJsonLd([
    { name: "Home", item: "/" },
    { name: "Gifts", item: "/shop" },
    { name: occ.title, item: `/gifts/${params.occasion}` },
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
            {occ.subtitle}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-wine mt-1">
            {occ.title}
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-3 max-w-xl mx-auto leading-relaxed">
            {occ.desc}
          </p>
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-12">
        <div className="mb-6 text-xs text-muted">
          Showing {products.length} hampers curated for {params.occasion}
        </div>

        {products.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-blush/80">
            <p className="font-serif text-xl font-bold text-wine">
              New curations arriving shortly.
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
