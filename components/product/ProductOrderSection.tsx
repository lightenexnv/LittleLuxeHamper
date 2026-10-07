"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, ArrowRight, MessageCircle, ShieldCheck, Check, Sparkles } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { ProductAddOns, AddOnItem } from "./ProductAddOns";
import { GiftMessageInput } from "./GiftMessageInput";
import { DeliveryDatePicker } from "./DeliveryDatePicker";
import { PincodeChecker } from "./PincodeChecker";
import { formatPrice } from "@/lib/money";
import { trackEvent, trackWhatsAppClick } from "@/lib/analytics";

export interface ProductDetailsForOrder {
  id: string;
  slug: string;
  name: string;
  pricePaise: number;
  mrpPaise: number;
  stock: number;
  primaryImageUrl: string;
  needsReview?: boolean;
}

export function ProductOrderSection({
  product,
  availableAddOns,
}: {
  product: ProductDetailsForOrder;
  availableAddOns: AddOnItem[];
}) {
  const router = useRouter();
  const { addItem, setGiftMessage, setDeliveryDate } = useCartStore();

  const [qty, setQty] = useState(1);
  const [selectedAddOnIds, setSelectedAddOnIds] = useState<string[]>([]);
  const [giftNote, setGiftNote] = useState("");
  const [deliveryDate, setSelectedDeliveryDate] = useState("");
  const [isAdded, setIsAdded] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  const isEnquireOnly = product.pricePaise === 0 || product.needsReview;

  // Compute live price with selected add-ons
  const selectedAddOns = availableAddOns.filter((a) =>
    selectedAddOnIds.includes(a.id)
  );
  const addOnsTotalPaise = selectedAddOns.reduce(
    (acc, item) => acc + item.pricePaise,
    0
  );
  const liveTotalPaise = (product.pricePaise + addOnsTotalPaise) * qty;

  const handleAddToCart = () => {
    if (isEnquireOnly) {
      handleWhatsAppEnquire();
      return;
    }

    addItem(
      {
        productId: product.id,
        slug: product.slug,
        name: product.name,
        pricePaise: product.pricePaise,
        mrpPaise: product.mrpPaise,
        imageUrl: product.primaryImageUrl,
      },
      qty,
      selectedAddOns.map((a) => ({
        id: a.id,
        name: a.name,
        pricePaise: a.pricePaise,
      }))
    );

    if (giftNote.trim()) {
      setGiftMessage(giftNote.trim());
    }
    if (deliveryDate) {
      setDeliveryDate(deliveryDate);
    }

    trackEvent("add_to_cart", {
      item_id: product.id,
      item_name: product.name,
      value: liveTotalPaise / 100,
      quantity: qty,
    });

    setIsAdded(true);
    setShowConfetti(true);
    setTimeout(() => setShowConfetti(false), 2000);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    if (isEnquireOnly) {
      handleWhatsAppEnquire();
      return;
    }
    handleAddToCart();
    router.push("/checkout");
  };

  const handleWhatsAppEnquire = () => {
    trackWhatsAppClick(product.name);
    const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210";
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://littleluxehamper.com";
    const waText = encodeURIComponent(
      `Hello Little Luxe Hamper! I would like to enquire about pricing and bespoke ordering for "${product.name}" (${siteUrl}/product/${product.slug}). Could you assist me with customization?`
    );
    window.open(`https://wa.me/${phone}?text=${waText}`, "_blank");
  };

  return (
    <div className="space-y-6 pt-4 relative">
      {/* Confetti Micro-Animation CSS */}
      {showConfetti && (
        <div className="absolute -top-12 inset-x-0 flex items-center justify-center pointer-events-none z-40">
          <div className="flex gap-2 animate-bounce">
            <span className="text-xl">✨</span>
            <span className="text-xl">🎀</span>
            <span className="text-xl">🌸</span>
            <span className="text-xl">💝</span>
            <span className="text-xl">✨</span>
          </div>
        </div>
      )}

      {/* Add-ons */}
      <ProductAddOns
        addOns={availableAddOns}
        selectedAddOnIds={selectedAddOnIds}
        onChange={setSelectedAddOnIds}
      />

      {/* Gift Message with Live Tag Preview */}
      <GiftMessageInput message={giftNote} onChange={setGiftNote} />

      {/* Delivery Date */}
      <DeliveryDatePicker
        selectedDate={deliveryDate}
        onChange={setSelectedDeliveryDate}
      />

      {/* Pincode Checker */}
      <PincodeChecker />

      {/* Quantity & CTAs */}
      <div className="space-y-3 pt-2">
        {!isEnquireOnly ? (
          <>
            <div className="flex items-center gap-4">
              {/* Stepper */}
              <div className="inline-flex items-center border border-blush rounded-full bg-white px-2 py-1 shadow-sm">
                <button
                  onClick={() => setQty((q) => Math.max(1, q - 1))}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-ink hover:text-wine hover:bg-blush/30 font-bold transition-colors"
                  aria-label="Decrease quantity"
                >
                  -
                </button>
                <span className="w-8 text-center font-bold text-sm text-wine">{qty}</span>
                <button
                  onClick={() => setQty((q) => Math.min(product.stock, q + 1))}
                  className="w-8 h-8 rounded-full flex items-center justify-center text-ink hover:text-wine hover:bg-blush/30 font-bold transition-colors"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>

              <div className="text-xs text-muted">
                Total: <strong className="text-wine text-base font-serif">{formatPrice(liveTotalPaise)}</strong>
              </div>
            </div>

            {/* Cart and Buy Now Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <button
                onClick={handleAddToCart}
                className={`shimmer-btn w-full py-3.5 px-6 rounded-pill font-bold text-sm flex items-center justify-center gap-2 shadow-luxe transition-all duration-300 ${
                  isAdded
                    ? "bg-success text-white"
                    : "bg-wine text-cream hover:bg-wine-light"
                }`}
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Basket!</span>
                  </>
                ) : (
                  <>
                    <ShoppingBag className="w-4 h-4" />
                    <span>Add To Gift Basket</span>
                  </>
                )}
              </button>

              <button
                onClick={handleBuyNow}
                className="w-full py-3.5 px-6 rounded-pill font-bold text-sm bg-gold hover:bg-gold-light text-ink flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <span>Buy Now</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </>
        ) : (
          /* Enquire on WhatsApp for products with needsReview / 0 price */
          <div className="space-y-3">
            <div className="p-4 rounded-2xl bg-blush/30 border border-gold/40 text-center">
              <p className="font-serif font-bold text-wine text-lg">Price Available on Request</p>
              <p className="text-xs text-muted mt-1 font-sans">
                This bespoke hamper is hand-assembled to your exact specifications. Contact our atelier directly on WhatsApp to personalize items and receive an instant quote.
              </p>
            </div>

            <button
              onClick={handleWhatsAppEnquire}
              className="w-full py-4 px-6 rounded-pill font-bold text-sm bg-success hover:bg-success/90 text-white flex items-center justify-center gap-2.5 shadow-luxe transition-all transform hover:-translate-y-0.5"
            >
              <MessageCircle className="w-5 h-5" />
              <span>Enquire &amp; Order on WhatsApp</span>
            </button>
          </div>
        )}

        {/* WhatsApp Consultation */}
        {!isEnquireOnly && (
          <div className="text-center pt-1">
            <button
              onClick={handleWhatsAppEnquire}
              className="inline-flex items-center gap-1.5 text-xs text-ink/80 hover:text-success font-semibold transition-colors py-1"
            >
              <MessageCircle className="w-4 h-4 text-success" />
              <span>Have a special request? Chat with our gifting concierge</span>
            </button>
          </div>
        )}
      </div>

      {/* Trust row */}
      <div className="pt-2 border-t border-blush/60 flex items-center justify-around text-center text-[11px] text-muted">
        <div>
          <ShieldCheck className="w-4 h-4 mx-auto text-gold mb-0.5" />
          <span>GST Tax Inclusive</span>
        </div>
        <div>
          <Sparkles className="w-4 h-4 mx-auto text-gold mb-0.5" />
          <span>Zero Breakage Guarantee</span>
        </div>
        <div>
          <ShieldCheck className="w-4 h-4 mx-auto text-gold mb-0.5" />
          <span>Tracked Courier Dispatch</span>
        </div>
      </div>

      {/* Mobile Sticky Add to Cart Bottom Bar */}
      <div className="fixed bottom-0 inset-x-0 bg-white/95 backdrop-blur-md border-t border-blush p-3 px-4 flex items-center justify-between gap-3 md:hidden z-30 shadow-2xl">
        <div className="min-w-0">
          <p className="font-serif font-bold text-wine text-base leading-tight truncate">
            {isEnquireOnly ? "Price on Request" : formatPrice(liveTotalPaise)}
          </p>
          <p className="text-[10px] text-muted truncate">{product.name}</p>
        </div>
        <button
          onClick={isEnquireOnly ? handleWhatsAppEnquire : handleAddToCart}
          className="px-6 py-2.5 rounded-pill bg-wine text-cream font-bold text-xs shrink-0 flex items-center gap-1.5 shadow-md hover:bg-wine-light transition-all"
        >
          {isEnquireOnly ? (
            <>
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Enquire</span>
            </>
          ) : (
            <>
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Add to Basket</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
