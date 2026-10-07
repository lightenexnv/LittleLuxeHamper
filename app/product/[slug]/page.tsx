import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Star, ShieldCheck, Truck, Sparkles } from "lucide-react";
import { db } from "@/lib/db";
import { ProductGallery } from "@/components/product/ProductGallery";
import { InstagramButton } from "@/components/product/InstagramButton";
import { ProductOrderSection } from "@/components/product/ProductOrderSection";
import { ProductAccordions } from "@/components/product/ProductAccordions";
import { ProductReviews } from "@/components/product/ProductReviews";
import { ProductCard } from "@/components/ui/ProductCard";
import { formatPrice, calculateDiscount } from "@/lib/money";
import {
  constructMetadata,
  generateProductJsonLd,
  generateBreadcrumbJsonLd,
} from "@/lib/seo";

interface ProductPageProps {
  params: {
    slug: string;
  };
}

export const revalidate = 300;

export async function generateStaticParams() {
  const products = await db.product.findMany({ select: { slug: true } });
  return products.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: ProductPageProps): Promise<Metadata> {
  const product = await db.product.findUnique({
    where: { slug: params.slug },
    include: { images: { orderBy: { sort: "asc" }, take: 1 } },
  });

  if (!product) return {};

  return constructMetadata({
    title: product.seoTitle || `${product.name} | Little Luxe Hamper`,
    description: product.seoDesc || product.shortDesc,
    image: product.images[0]?.url,
    canonicalUrl: `/product/${product.slug}`,
  });
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  const product = await db.product.findUnique({
    where: { slug: params.slug },
    include: {
      images: { orderBy: { sort: "asc" } },
      reels: { orderBy: { sort: "asc" } },
      reviews: { where: { approved: true }, orderBy: { createdAt: "desc" } },
      collections: { select: { id: true, slug: true, name: true } },
    },
  });

  if (!product) notFound();

  // Load available add-ons
  const addOns = await db.addOn.findMany({
    where: { isActive: true },
  });

  // Load related products from the same collection
  const firstCollectionId = product.collections[0]?.id;
  const relatedProducts = await db.product.findMany({
    where: {
      isActive: true,
      id: { not: product.id },
      ...(firstCollectionId
        ? { collections: { some: { id: firstCollectionId } } }
        : {}),
    },
    include: { images: { orderBy: { sort: "asc" } } },
    take: 4,
  });

  const parsedContents: string[] = (() => {
    try {
      return JSON.parse(product.contents);
    } catch {
      return [];
    }
  })();

  const discount = calculateDiscount(product.mrpPaise, product.pricePaise);
  const primaryReel = product.reels[0];

  // Structured Data
  const productJsonLd = generateProductJsonLd({
    name: product.name,
    description: product.description,
    sku: product.sku,
    pricePaise: product.pricePaise,
    mrpPaise: product.mrpPaise,
    images: product.images.map((img) => img.url),
    inStock: product.stock > 0,
    ratingValue: product.reviews.length > 0 ? 5.0 : undefined,
    reviewCount: product.reviews.length > 0 ? product.reviews.length : undefined,
    url: `/product/${product.slug}`,
  });

  const breadcrumbsJsonLd = generateBreadcrumbJsonLd([
    { name: "Home", item: "/" },
    { name: "Shop", item: "/shop" },
    { name: product.name, item: `/product/${product.slug}` },
  ]);

  return (
    <div className="bg-cream min-h-screen py-8 sm:py-12">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbsJsonLd) }}
      />

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        {/* Breadcrumb row */}
        <nav className="text-xs text-muted mb-6 flex items-center gap-2">
          <a href="/" className="hover:text-wine">Home</a>
          <span>/</span>
          <a href="/shop" className="hover:text-wine">Hampers</a>
          <span>/</span>
          <span className="text-ink font-semibold truncate">{product.name}</span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Gallery & Instagram Button */}
          <div className="lg:col-span-7 space-y-4">
            <ProductGallery
              images={product.images}
              reels={product.reels}
            />

            {/* View on Instagram Gradient Button below gallery */}
            <InstagramButton
              reelUrl={primaryReel?.instagramUrl}
              productName={product.name}
            />
          </div>

          {/* Right Column: Pricing, Product Details, Order Flow */}
          <div className="lg:col-span-5 space-y-6">
            <div>
              {/* Sample Tag & Badges */}
              <div className="flex items-center gap-2 mb-2">
                {product.isSample && (
                  <span className="bg-gold/20 text-gold-dark text-[10px] font-bold px-2 py-0.5 rounded uppercase tracking-wider">
                    SAMPLE HAMPER
                  </span>
                )}
                {product.isCustomizable && (
                  <span className="bg-blush text-wine text-[10px] font-semibold px-2 py-0.5 rounded uppercase tracking-wider">
                    Customizable
                  </span>
                )}
              </div>

              {/* Title */}
              <h1 className="font-serif text-3xl sm:text-4xl font-bold text-wine leading-tight">
                {product.name}
              </h1>

              {/* Reviews Summary */}
              <div className="flex items-center gap-2 mt-2">
                <div className="flex text-gold">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-gold text-gold" />
                  ))}
                </div>
                <span className="text-xs text-muted font-medium">
                  5.0 ({product.reviews.length} reviews)
                </span>
                <span className="text-muted">&bull;</span>
                <span className="text-xs text-success font-semibold flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5" />
                  <span>Pan-India Ready</span>
                </span>
              </div>

              {/* Price Block */}
              <div className="mt-4 p-4 rounded-2xl bg-white border border-blush/70 flex items-baseline gap-3">
                {product.pricePaise > 0 && !product.needsReview ? (
                  <>
                    <span className="font-serif text-3xl font-bold text-wine">
                      {formatPrice(product.pricePaise)}
                    </span>
                    {product.mrpPaise > product.pricePaise && (
                      <span className="text-sm text-muted line-through">
                        {formatPrice(product.mrpPaise)}
                      </span>
                    )}
                    {discount > 0 && (
                      <span className="bg-wine text-white text-xs font-bold px-2 py-0.5 rounded-full">
                        {discount}% OFF
                      </span>
                    )}
                  </>
                ) : (
                  <span className="font-serif text-2xl font-bold text-rose-dark">
                    Price Available on Request
                  </span>
                )}
                <span className="text-[11px] text-muted ml-auto font-medium">
                  GST Inclusive
                </span>
              </div>

              {/* Short Description */}
              <p className="text-xs sm:text-sm text-ink/80 mt-4 leading-relaxed font-sans">
                {product.shortDesc}
              </p>
            </div>

            {/* Interactive Order Section (Addons, Note, Date, Pincode, Buy) */}
            <ProductOrderSection
              product={{
                id: product.id,
                slug: product.slug,
                name: product.name,
                pricePaise: product.pricePaise,
                mrpPaise: product.mrpPaise,
                stock: product.stock,
                primaryImageUrl: product.images[0]?.url || "",
                needsReview: product.needsReview,
              }}
              availableAddOns={addOns}
            />

            {/* Detailed Accordions */}
            <ProductAccordions
              contents={parsedContents}
              sku={product.sku}
            />
          </div>
        </div>

        {/* Customer Reviews Section */}
        <ProductReviews
          productId={product.id}
          reviews={product.reviews}
        />

        {/* Related Hampers Upsell ("Complete the gift") */}
        {relatedProducts.length > 0 && (
          <section className="mt-20 pt-12 border-t border-blush/80">
            <div className="mb-8">
              <span className="text-xs font-bold text-gold uppercase tracking-widest">
                More From The Atelier
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-bold text-wine mt-1">
                You May Also Adore
              </h2>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  slug={p.slug}
                  name={p.name}
                  pricePaise={p.pricePaise}
                  mrpPaise={p.mrpPaise}
                  isSample={p.isSample}
                  needsReview={p.needsReview}
                  images={p.images}
                />
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
}
