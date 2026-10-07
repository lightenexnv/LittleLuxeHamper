import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { db } from "@/lib/db";
import { Hero } from "@/components/home/Hero";
import { MarqueeBand } from "@/components/home/MarqueeBand";
import { OccasionTiles } from "@/components/home/OccasionTiles";
import { ReelsStrip } from "@/components/home/ReelsStrip";
import { BudgetShortcuts } from "@/components/home/BudgetShortcuts";
import { UnboxingStory } from "@/components/home/UnboxingStory";
import { CustomHamperBanner } from "@/components/home/CustomHamperBanner";
import { WhyUs } from "@/components/home/WhyUs";
import { InstagramGrid } from "@/components/home/InstagramGrid";
import { FaqAccordion } from "@/components/home/FaqAccordion";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { ProductCard } from "@/components/ui/ProductCard";

export const revalidate = 300; // ISR 5 minutes

export default async function HomePage() {
  // Fetch authentic products
  const bestsellers = await db.product.findMany({
    where: { isActive: true },
    include: {
      images: { orderBy: { sort: "asc" } },
    },
    take: 8,
    orderBy: { createdAt: "desc" },
  });

  // Fetch authentic reels for home strip
  const homeReels = await db.reel.findMany({
    where: { showOnHome: true },
    include: {
      product: {
        select: { slug: true, name: true },
      },
    },
    orderBy: { sort: "asc" },
  });

  return (
    <div className="flex flex-col">
      {/* 1. Hero with Real Photography & LCP Priority */}
      <Hero />

      {/* 2. Continuous Marquee Text Band */}
      <MarqueeBand />

      {/* 3. Occasion Tiles with Arch Masks */}
      <OccasionTiles />

      {/* 4. Instagram Reels ROLL Section (Signature Opposite-Scrolling Strip) */}
      <ReelsStrip reels={homeReels} />

      {/* 5. Signature Bestsellers Grid with Real Photos & Crossfade */}
      <section className="py-12 sm:py-20 bg-cream relative">
        <div className="max-w-[1280px] mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 sm:gap-4 mb-8 sm:mb-12">
            <div>
              <div className="inline-flex items-center gap-1.5 text-[11px] sm:text-xs uppercase tracking-widest text-gold font-bold mb-1 sm:mb-1.5">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Loved Across India</span>
              </div>
              <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-bold text-mulberry tracking-tight">
                Signature Handcrafted Hampers
              </h2>
              <p className="text-xs sm:text-sm text-muted mt-1.5 sm:mt-2 max-w-xl font-sans">
                Each curation is assembled by hand, wrapped in satin ribbon, and illuminated with warm fairy lights.
              </p>
            </div>

            <Link
              href="/shop"
              className="inline-flex items-center gap-2 text-xs font-bold text-wine hover:text-gold-dark transition-colors py-1 group shrink-0"
            >
              <span>Explore Complete Catalogue</span>
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {bestsellers.map((prod) => (
              <ProductCard
                key={prod.id}
                id={prod.id}
                slug={prod.slug}
                name={prod.name}
                pricePaise={prod.pricePaise}
                mrpPaise={prod.mrpPaise}
                isSample={prod.isSample}
                needsReview={prod.needsReview}
                images={prod.images}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 6. Unboxing Story (Interactive Scroll Narrative with Real Photos) */}
      <UnboxingStory />

      {/* 7. Shop by Budget */}
      <BudgetShortcuts />

      {/* 8. Custom Hamper Banner */}
      <CustomHamperBanner />

      {/* 9. Why Us & Atelier Promise */}
      <WhyUs />

      {/* 10. Instagram Community & Follow Grid */}
      <InstagramGrid />

      {/* 11. FAQ & Newsletter */}
      <FaqAccordion />
      <NewsletterSection />
    </div>
  );
}
