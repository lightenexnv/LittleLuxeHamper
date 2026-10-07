import React from "react";
import Link from "next/link";
import { ArrowRight, Sparkles } from "lucide-react";
import { db } from "@/lib/db";
import { Hero } from "@/components/home/Hero";
import { OccasionTiles } from "@/components/home/OccasionTiles";
import { ReelsStrip } from "@/components/home/ReelsStrip";
import { BudgetShortcuts } from "@/components/home/BudgetShortcuts";
import { HowItWorks } from "@/components/home/HowItWorks";
import { CustomHamperBanner } from "@/components/home/CustomHamperBanner";
import { WhyUs } from "@/components/home/WhyUs";
import { TestimonialsCarousel } from "@/components/home/TestimonialsCarousel";
import { InstagramGrid } from "@/components/home/InstagramGrid";
import { FaqAccordion } from "@/components/home/FaqAccordion";
import { NewsletterSection } from "@/components/home/NewsletterSection";
import { ProductCard } from "@/components/ui/ProductCard";

export const revalidate = 300; // ISR 5 minutes

export default async function HomePage() {
  // Fetch bestsellers
  const bestsellers = await db.product.findMany({
    where: { isActive: true },
    include: {
      images: { orderBy: { sort: "asc" } },
    },
    take: 8,
    orderBy: { createdAt: "desc" },
  });

  // Fetch reels for home strip
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
      {/* 1. Hero with LCP Priority */}
      <Hero />

      {/* 2. Occasion Tiles */}
      <OccasionTiles />

      {/* 3. Reels Strip ("As Seen On Instagram") */}
      <ReelsStrip reels={homeReels} />

      {/* 4. Bestsellers Grid */}
      <section className="py-16 bg-cream">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-10">
            <div>
              <div className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest text-gold font-bold mb-1">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Loved Across India</span>
              </div>
              <h2 className="font-serif text-3xl sm:text-4xl font-bold text-wine">
                Signature Bestsellers
              </h2>
              <p className="text-xs sm:text-sm text-muted mt-1.5">
                Our most coveted artisanal curations, ribbon-tied and ready to captivate.
              </p>
            </div>

            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-wine hover:text-gold-dark transition-colors py-1 group"
            >
              <span>View All Hampers</span>
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
                images={prod.images}
              />
            ))}
          </div>
        </div>
      </section>

      {/* 5. Shop by Budget */}
      <BudgetShortcuts />

      {/* 6. How It Works */}
      <HowItWorks />

      {/* 7. Custom Hamper Split Banner */}
      <CustomHamperBanner />

      {/* 8. Why Us */}
      <WhyUs />

      {/* 9. Testimonials Carousel (Flagged SAMPLE) */}
      <TestimonialsCarousel />

      {/* 10. Instagram Community & Follow Grid */}
      <InstagramGrid />

      {/* 11. FAQ & Newsletter */}
      <FaqAccordion />
      <NewsletterSection />
    </div>
  );
}
