"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingBag, Check } from "lucide-react";
import { formatPrice, calculateDiscount } from "@/lib/money";
import { useCartStore } from "@/lib/cart-store";
import { trackEvent } from "@/lib/analytics";

export interface ProductCardProps {
  id: string;
  slug: string;
  name: string;
  pricePaise: number;
  mrpPaise: number;
  isSample?: boolean;
  images: { url: string; alt: string }[];
  rating?: number;
  reviewCount?: number;
}

export function ProductCard({
  id,
  slug,
  name,
  pricePaise,
  mrpPaise,
  isSample = true,
  images,
  rating = 5,
  reviewCount = 12,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [added, setAdded] = useState(false);
  const { addItem } = useCartStore();

  const discount = calculateDiscount(mrpPaise, pricePaise);
  const primaryImage = images[0]?.url || "/images/products/royal-velvet-anniversary-hamper-1.svg";
  const secondaryImage = images[1]?.url || primaryImage;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    addItem({
      productId: id,
      slug,
      name,
      pricePaise,
      mrpPaise,
      imageUrl: primaryImage,
    });

    trackEvent("add_to_cart", {
      item_id: id,
      item_name: name,
      price: pricePaise / 100,
    });

    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div
      className="group relative bg-white rounded-card overflow-hidden shadow-sm hover:shadow-luxe transition-all duration-300 border border-blush/60 flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Frame (4:5 Aspect Ratio) */}
      <Link
        href={`/product/${slug}`}
        data-testid="product-card-link"
        className="relative block aspect-[4/5] overflow-hidden bg-blush/10"
      >
        <Image
          src={isHovered ? secondaryImage : primaryImage}
          alt={images[0]?.alt || name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className="object-cover transition-transform duration-500 group-hover:scale-105"
        />

        {/* SAMPLE & Discount Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {discount > 0 && (
            <span className="bg-wine text-white text-[10px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
              {discount}% OFF
            </span>
          )}
          {isSample && (
            <span className="bg-gold/90 text-white text-[9px] font-semibold px-1.5 py-0.5 rounded tracking-wider uppercase">
              SAMPLE
            </span>
          )}
        </div>

        {/* Quick Add Floating Button on Desktop */}
        <div className="absolute inset-x-3 bottom-3 hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200 z-10">
          <button
            onClick={handleQuickAdd}
            className={`w-full py-2.5 px-4 rounded-pill font-medium text-xs flex items-center justify-center gap-1.5 shadow-md transition-all ${
              added
                ? "bg-success text-white"
                : "bg-white/95 text-wine hover:bg-wine hover:text-white"
            }`}
            aria-label={`Add ${name} to gift basket`}
          >
            {added ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added to Basket</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Quick Add</span>
              </>
            )}
          </button>
        </div>
      </Link>

      {/* Product Details */}
      <div className="p-4 flex-1 flex flex-col justify-between">
        <div>
          {/* Star Rating */}
          <div className="flex items-center gap-1 mb-1.5">
            <div className="flex text-gold">
              {[...Array(5)].map((_, i) => (
                <Star
                  key={i}
                  className={`w-3 h-3 ${
                    i < rating ? "fill-gold text-gold" : "text-blush fill-blush"
                  }`}
                />
              ))}
            </div>
            <span className="text-[11px] text-muted">({reviewCount})</span>
          </div>

          {/* Product Name */}
          <Link href={`/product/${slug}`} className="block">
            <h3 className="font-serif font-bold text-ink text-sm sm:text-base group-hover:text-wine transition-colors line-clamp-1">
              {name}
            </h3>
          </Link>
        </div>

        {/* Pricing & Mobile Add */}
        <div className="mt-3 pt-2.5 border-t border-blush/40 flex items-center justify-between">
          <div className="flex items-baseline gap-2">
            <span className="font-serif font-bold text-wine text-base sm:text-lg">
              {formatPrice(pricePaise)}
            </span>
            {mrpPaise > pricePaise && (
              <span className="text-xs text-muted line-through">
                {formatPrice(mrpPaise)}
              </span>
            )}
          </div>

          {/* Mobile Quick Add Button */}
          <button
            onClick={handleQuickAdd}
            className="md:hidden p-2 rounded-full bg-cream text-wine hover:bg-wine hover:text-white border border-blush transition-colors"
            aria-label="Add to cart"
          >
            <ShoppingBag className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
