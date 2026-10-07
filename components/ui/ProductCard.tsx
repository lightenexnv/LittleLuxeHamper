"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Star, ShoppingBag, Check, Heart, MessageCircle } from "lucide-react";
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
  needsReview?: boolean;
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
  isSample = false,
  needsReview = false,
  images,
  rating = 5,
  reviewCount = 18,
}: ProductCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [added, setAdded] = useState(false);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const { addItem } = useCartStore();

  const isEnquireOnly = pricePaise === 0 || needsReview;
  const discount = calculateDiscount(mrpPaise, pricePaise);
  const primaryImage = images[0]?.url || "/media/images/3954806144118936893_25237603949.webp";
  const secondaryImage = images[1]?.url || primaryImage;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isEnquireOnly) {
      window.open(
        `https://wa.me/919876543210?text=${encodeURIComponent(
          `Hi Little Luxe Hamper! I would love to enquire about pricing and customization for ${name}.`
        )}`,
        "_blank"
      );
      return;
    }

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

  const handleToggleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsWishlisted(!isWishlisted);
  };

  return (
    <div
      className="group relative bg-white rounded-gift overflow-hidden shadow-luxe-card hover:shadow-luxe-lg transition-all duration-500 border border-blush/60 flex flex-col transform hover:-translate-y-1"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Frame (4:5 Aspect Ratio) with Crossfade */}
      <Link
        href={`/product/${slug}`}
        data-testid="product-card-link"
        className="relative block aspect-[4/5] overflow-hidden bg-sand/30"
      >
        {/* Primary Image */}
        <Image
          src={primaryImage}
          alt={images[0]?.alt || name}
          fill
          sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
          className={`object-cover transition-all duration-700 ${
            isHovered && secondaryImage !== primaryImage ? "opacity-0 scale-105" : "opacity-100 scale-100"
          }`}
        />

        {/* Secondary Crossfade Image on Desktop Hover */}
        {secondaryImage !== primaryImage && (
          <Image
            src={secondaryImage}
            alt={`${name} secondary view`}
            fill
            sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
            className={`object-cover transition-all duration-700 absolute inset-0 ${
              isHovered ? "opacity-100 scale-105" : "opacity-0 scale-100"
            }`}
          />
        )}

        {/* Status / Discount Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {!isEnquireOnly && discount > 0 && (
            <span className="bg-wine/90 backdrop-blur-sm text-white text-[10px] font-bold px-2.5 py-0.5 rounded-full uppercase tracking-wider shadow-sm">
              {discount}% OFF
            </span>
          )}
          {isEnquireOnly && (
            <span className="bg-rose-dark/90 backdrop-blur-sm text-white text-[9px] font-bold px-2 py-0.5 rounded-full tracking-wider uppercase shadow-sm">
              BESPOKE
            </span>
          )}
          {isSample && (
            <span className="bg-gold/90 text-white text-[9px] font-semibold px-2 py-0.5 rounded-full tracking-wider uppercase">
              SAMPLE
            </span>
          )}
        </div>

        {/* Wishlist Heart Icon with Micro-animation */}
        <button
          onClick={handleToggleWishlist}
          aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 shadow-sm ${
            isWishlisted
              ? "bg-rose text-white scale-110"
              : "bg-white/85 text-muted hover:text-rose hover:bg-white backdrop-blur-sm"
          }`}
        >
          <Heart className={`w-4 h-4 transition-transform ${isWishlisted ? "fill-current scale-110" : ""}`} />
        </button>

        {/* Quick Add Floating Button on Desktop */}
        <div className="absolute inset-x-3 bottom-3 hidden md:flex items-center justify-center opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-y-2 group-hover:translate-y-0 z-10">
          <button
            onClick={handleQuickAdd}
            className={`w-full py-2.5 px-4 rounded-pill font-medium text-xs flex items-center justify-center gap-2 shadow-luxe transition-all ${
              isEnquireOnly
                ? "bg-white/95 text-wine hover:bg-wine hover:text-white"
                : added
                ? "bg-success text-white"
                : "bg-white/95 text-wine hover:bg-wine hover:text-white"
            }`}
            aria-label={isEnquireOnly ? `Enquire about ${name}` : `Add ${name} to gift basket`}
          >
            {isEnquireOnly ? (
              <>
                <MessageCircle className="w-3.5 h-3.5 text-success" />
                <span>Enquire on WhatsApp</span>
              </>
            ) : added ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added to Basket</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5 text-gold" />
                <span>Quick Add</span>
              </>
            )}
          </button>
        </div>
      </Link>

      {/* Product Details */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Star Rating */}
          <div className="flex items-center gap-1.5 mb-2">
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
            <span className="text-[11px] text-muted font-medium">({reviewCount})</span>
          </div>

          {/* Product Name */}
          <Link href={`/product/${slug}`} className="block">
            <h3 className="font-serif font-bold text-mulberry text-base group-hover:text-wine transition-colors line-clamp-1">
              {name}
            </h3>
          </Link>
        </div>

        {/* Pricing & Mobile Action */}
        <div className="mt-3.5 pt-3 border-t border-blush/40 flex items-center justify-between">
          <div>
            {isEnquireOnly ? (
              <span className="font-serif font-medium text-rose-dark text-sm">
                Price on Request
              </span>
            ) : (
              <div className="flex items-baseline gap-2">
                <span className="font-serif font-bold text-wine text-base sm:text-lg">
                  {formatPrice(pricePaise)}
                </span>
                {mrpPaise > pricePaise && (
                  <span className="text-xs text-muted line-through font-sans">
                    {formatPrice(mrpPaise)}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Mobile Quick Action Button */}
          <button
            onClick={handleQuickAdd}
            className="md:hidden p-2 rounded-full bg-cream text-wine hover:bg-wine hover:text-white border border-blush transition-colors"
            aria-label={isEnquireOnly ? "Enquire on WhatsApp" : "Add to cart"}
          >
            {isEnquireOnly ? (
              <MessageCircle className="w-4 h-4 text-wine" />
            ) : (
              <ShoppingBag className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
