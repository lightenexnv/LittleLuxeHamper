"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { ShoppingBag, ArrowRight, MessageCircle, ShieldCheck, Check } from "lucide-react";
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
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = () => {
    handleAddToCart();
    router.push("/checkout");
  };

  // WhatsApp Order fallback
  const phone = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210";
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://littleluxehamper.com";
  const waText = encodeURIComponent(
    `Hello Little Luxe Hamper! I would like to order the "${product.name}" (${siteUrl}/product/${product.slug}). Could you assist me with customization & dispatch?`
  );

  return (
    <div className="space-y-6 pt-4">
      {/* Add-ons */}
      <ProductAddOns
        addOns={availableAddOns}
        selectedAddOnIds={selectedAddOnIds}
        onChange={setSelectedAddOnIds}
      />

      {/* Gift Message */}
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

        {/* Primary and Secondary CTA Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <button
            onClick={handleAddToCart}
            className={`w-full py-3.5 px-6 rounded-pill font-bold text-sm flex items-center justify-center gap-2 shadow-luxe transition-all duration-300 ${
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

        {/* Order via WhatsApp Fallback */}
        <div className="text-center pt-1">
          <a
            href={`https://wa.me/${phone}?text=${waText}`}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackWhatsAppClick(product.name)}
            className="inline-flex items-center gap-1.5 text-xs text-ink/80 hover:text-success font-semibold transition-colors py-1"
          >
            <MessageCircle className="w-4 h-4 text-success" />
            <span>Prefer to order or customize via WhatsApp? Chat with concierge</span>
          </a>
        </div>
      </div>

      {/* Trust row */}
      <div className="pt-2 border-t border-blush/60 flex items-center justify-around text-center text-[11px] text-muted">
        <div>
          <ShieldCheck className="w-4 h-4 mx-auto text-gold mb-0.5" />
          <span>GST Tax Inclusive</span>
        </div>
        <div>
          <ShieldCheck className="w-4 h-4 mx-auto text-gold mb-0.5" />
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
            {formatPrice(liveTotalPaise)}
          </p>
          <p className="text-[10px] text-muted truncate">{product.name}</p>
        </div>
        <button
          onClick={handleAddToCart}
          className="px-6 py-2.5 rounded-pill bg-wine text-cream font-bold text-xs shrink-0 flex items-center gap-1.5 shadow-md hover:bg-wine-light transition-all"
        >
          <ShoppingBag className="w-3.5 h-3.5" />
          <span>Add to Basket</span>
        </button>
      </div>
    </div>
  );
}
