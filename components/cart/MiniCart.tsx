"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { X, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/money";
import { FREE_SHIPPING_THRESHOLD_PAISE } from "@/lib/pricing";

export function MiniCart() {
  const {
    items,
    removeItem,
    updateQty,
    isMiniCartOpen,
    setMiniCartOpen,
    getSubtotalPaise,
  } = useCartStore();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || !isMiniCartOpen) return null;

  const subtotalPaise = getSubtotalPaise();
  const diffForFreeShip = Math.max(0, FREE_SHIPPING_THRESHOLD_PAISE - subtotalPaise);
  const progressPercent = Math.min(
    100,
    Math.round((subtotalPaise / FREE_SHIPPING_THRESHOLD_PAISE) * 100)
  );

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-ink/50 backdrop-blur-sm transition-opacity"
        onClick={() => setMiniCartOpen(false)}
        aria-hidden="true"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-cream shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-5 border-b border-blush flex items-center justify-between bg-white">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-wine" />
              <h2 className="text-xl font-serif font-bold text-wine">Your Gift Basket</h2>
              <span className="text-xs bg-blush text-wine px-2 py-0.5 rounded-full font-medium">
                {items.length} {items.length === 1 ? "item" : "items"}
              </span>
            </div>
            <button
              onClick={() => setMiniCartOpen(false)}
              className="p-2 text-muted hover:text-ink rounded-full hover:bg-cream transition-colors"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Free Shipping Progress */}
          <div className="p-4 bg-blush/40 border-b border-blush/60 text-xs">
            {diffForFreeShip > 0 ? (
              <p className="text-ink font-medium mb-1.5">
                Add <span className="font-bold text-wine">{formatPrice(diffForFreeShip)}</span> more to unlock <span className="text-wine font-bold">FREE Pan-India Delivery!</span>
              </p>
            ) : (
              <p className="text-success font-semibold mb-1.5 flex items-center gap-1">
                🎉 Congratulations! You have unlocked FREE Express Delivery!
              </p>
            )}
            <div className="w-full bg-white h-2 rounded-full overflow-hidden">
              <div
                className="bg-gold h-full rounded-full transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Item List */}
          <div className="flex-1 overflow-y-auto p-5 space-y-4">
            {items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 text-muted">
                <ShoppingBag className="w-12 h-12 text-rose/50 mb-3" />
                <p className="font-serif text-lg text-wine font-medium">Your gift basket is waiting</p>
                <p className="text-sm mt-1 mb-5">Browse our curated boutique hampers to begin.</p>
                <Link
                  href="/shop"
                  onClick={() => setMiniCartOpen(false)}
                  className="px-6 py-2.5 rounded-pill bg-wine text-white text-sm font-medium hover:bg-wine-light transition-colors"
                >
                  Explore Hampers
                </Link>
              </div>
            ) : (
              items.map((item) => (
                <div
                  key={item.productId}
                  className="flex gap-4 p-3 bg-white rounded-card shadow-sm border border-blush/50"
                >
                  <div className="relative w-20 h-24 rounded-lg overflow-hidden shrink-0 bg-blush/20">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                  </div>

                  <div className="flex-1 min-w-0 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-1">
                        <Link
                          href={`/product/${item.slug}`}
                          onClick={() => setMiniCartOpen(false)}
                          className="font-serif font-semibold text-wine hover:underline text-sm line-clamp-1"
                        >
                          {item.name}
                        </Link>
                        <button
                          onClick={() => removeItem(item.productId)}
                          className="text-muted hover:text-error p-1 transition-colors"
                          aria-label="Remove item"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-xs text-wine font-bold mt-0.5">
                        {formatPrice(item.pricePaise)}
                      </p>

                      {item.addOns.length > 0 && (
                        <div className="mt-1 text-[11px] text-muted">
                          {item.addOns.map((addon) => (
                            <div key={addon.id} className="flex justify-between">
                              <span>+ {addon.name}</span>
                              <span>{formatPrice(addon.pricePaise)}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>

                    <div className="flex items-center gap-3 mt-2">
                      <div className="inline-flex items-center border border-blush rounded-full text-xs bg-cream">
                        <button
                          onClick={() => updateQty(item.productId, item.qty - 1)}
                          className="px-2.5 py-1 text-ink hover:text-wine font-medium"
                          aria-label="Decrease quantity"
                        >
                          -
                        </button>
                        <span className="px-2 font-semibold text-wine">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.productId, item.qty + 1)}
                          className="px-2.5 py-1 text-ink hover:text-wine font-medium"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Totals & CTA */}
          {items.length > 0 && (
            <div className="p-5 border-t border-blush bg-white space-y-3">
              <div className="flex justify-between items-baseline">
                <span className="text-sm text-muted">Estimated Subtotal (GST incl.)</span>
                <span className="text-lg font-serif font-bold text-wine">
                  {formatPrice(subtotalPaise)}
                </span>
              </div>
              <p className="text-[11px] text-muted">
                Final shipping and coupons calculated at checkout.
              </p>

              <div className="grid grid-cols-2 gap-3 pt-1">
                <Link
                  href="/cart"
                  onClick={() => setMiniCartOpen(false)}
                  className="w-full py-2.5 text-center rounded-pill border border-wine text-wine font-medium text-sm hover:bg-blush/40 transition-colors"
                >
                  View Basket
                </Link>
                <Link
                  href="/checkout"
                  onClick={() => setMiniCartOpen(false)}
                  className="w-full py-2.5 text-center rounded-pill bg-wine text-cream font-medium text-sm hover:bg-wine-light transition-all flex items-center justify-center gap-1.5 shadow-sm"
                >
                  <span>Checkout</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
