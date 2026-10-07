"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Trash2, ShoppingBag, ArrowRight, ShieldCheck, Tag, Loader2, Sparkles } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { formatPrice } from "@/lib/money";
import { FREE_SHIPPING_THRESHOLD_PAISE, PricingCalculationResult } from "@/lib/pricing";

export default function CartPage() {
  const {
    items,
    removeItem,
    updateQty,
    couponCode,
    setCouponCode,
    giftMessage,
    setGiftMessage,
  } = useCartStore();

  const [mounted, setMounted] = useState(false);
  const [couponInput, setCouponInput] = useState(couponCode || "");
  const [pricing, setPricing] = useState<PricingCalculationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [couponError, setCouponError] = useState<string | null>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Fetch server-calculated pricing whenever items or couponCode change
  useEffect(() => {
    if (!mounted || items.length === 0) {
      setPricing(null);
      return;
    }

    let isCancelled = false;
    async function calculate() {
      setLoading(true);
      try {
        const res = await fetch("/api/cart/price", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            items: items.map((i) => ({
              productId: i.productId,
              qty: i.qty,
              addOnIds: i.addOns.map((a) => a.id),
            })),
            couponCode,
          }),
        });

        if (res.ok) {
          const data = await res.json();
          if (!isCancelled) {
            setPricing(data);
            if (couponCode && !data.appliedCoupon) {
              setCouponError("Coupon code is invalid or does not meet minimum order");
            } else {
              setCouponError(null);
            }
          }
        }
      } catch {
        // Fallback to client pricing if offline
      } finally {
        if (!isCancelled) setLoading(false);
      }
    }

    calculate();
    return () => {
      isCancelled = true;
    };
  }, [mounted, items, couponCode]);

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;
    setCouponCode(couponInput.trim().toUpperCase());
  };

  const handleRemoveCoupon = () => {
    setCouponCode("");
    setCouponInput("");
    setCouponError(null);
  };

  if (!mounted) {
    return <div className="min-h-[60vh] bg-cream" />;
  }

  if (items.length === 0) {
    return (
      <div className="min-h-[70vh] bg-cream py-20">
        <div className="max-w-md mx-auto px-4 text-center">
          <div className="w-16 h-16 rounded-full bg-blush/60 text-wine flex items-center justify-center mx-auto mb-4">
            <ShoppingBag className="w-8 h-8" />
          </div>
          <h1 className="font-serif text-3xl font-bold text-wine">
            Your Gift Basket is Waiting
          </h1>
          <p className="text-sm text-muted mt-2 mb-8">
            Explore our artisanal gift hampers and bespoke curations to begin.
          </p>
          <Link
            href="/shop"
            className="px-8 py-3.5 rounded-pill bg-wine text-white font-medium text-sm hover:bg-wine-light transition-colors inline-block shadow-md"
          >
            Explore Hampers
          </Link>
        </div>
      </div>
    );
  }

  const subtotalPaise = pricing ? pricing.subtotalPaise + pricing.addOnsTotalPaise : 0;
  const progressPercent = Math.min(
    100,
    Math.round((subtotalPaise / FREE_SHIPPING_THRESHOLD_PAISE) * 100)
  );
  const diffForFreeShip = Math.max(0, FREE_SHIPPING_THRESHOLD_PAISE - subtotalPaise);

  return (
    <div className="bg-cream min-h-screen py-10 sm:py-16">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="mb-8">
          <span className="text-xs font-bold text-gold uppercase tracking-widest">
            Ready to Celebrate
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-wine mt-1">
            Review Your Gift Basket
          </h1>
        </div>

        {/* Free Shipping Alert Bar */}
        <div className="mb-8 p-4 bg-white rounded-2xl border border-blush/80 shadow-sm">
          <div className="flex items-center justify-between text-xs font-medium mb-2">
            <span>
              {diffForFreeShip > 0 ? (
                <span>
                  Add <strong className="text-wine">{formatPrice(diffForFreeShip)}</strong> more for <strong>FREE Pan-India Delivery!</strong>
                </span>
              ) : (
                <span className="text-success font-semibold">
                  🎉 You have unlocked complimentary Express Pan-India Delivery!
                </span>
              )}
            </span>
            <span className="text-muted font-bold">{progressPercent}%</span>
          </div>
          <div className="w-full bg-cream h-2.5 rounded-full overflow-hidden border border-blush/40">
            <div
              className="bg-gold h-full rounded-full transition-all duration-500"
              style={{ width: `${progressPercent}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left: Cart Items List */}
          <div className="lg:col-span-8 space-y-4">
            {items.map((item) => (
              <div
                key={item.productId}
                className="p-4 sm:p-5 bg-white rounded-2xl border border-blush/80 shadow-sm flex flex-col sm:flex-row gap-4 sm:items-center justify-between"
              >
                <div className="flex gap-4 items-center">
                  <div className="relative w-20 h-24 sm:w-24 sm:h-28 rounded-xl overflow-hidden shrink-0 bg-cream">
                    <Image
                      src={item.imageUrl}
                      alt={item.name}
                      fill
                      sizes="96px"
                      className="object-cover"
                    />
                  </div>

                  <div>
                    <Link
                      href={`/product/${item.slug}`}
                      className="font-serif font-bold text-wine hover:underline text-base sm:text-lg block"
                    >
                      {item.name}
                    </Link>
                    <p className="text-xs font-bold text-ink mt-0.5">
                      {formatPrice(item.pricePaise)} each
                    </p>

                    {item.addOns.length > 0 && (
                      <div className="mt-2 text-xs text-muted space-y-0.5">
                        {item.addOns.map((addon) => (
                          <div key={addon.id} className="flex gap-2">
                            <span>+ {addon.name}</span>
                            <span className="font-semibold text-wine">
                              ({formatPrice(addon.pricePaise)})
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-4 pt-2 sm:pt-0 border-t sm:border-0 border-blush/40">
                  <div className="inline-flex items-center border border-blush rounded-full bg-cream px-2 py-1">
                    <button
                      onClick={() => updateQty(item.productId, item.qty - 1)}
                      className="w-7 h-7 flex items-center justify-center font-bold text-ink hover:text-wine"
                      aria-label="Decrease quantity"
                    >
                      -
                    </button>
                    <span className="w-8 text-center text-xs font-bold text-wine">{item.qty}</span>
                    <button
                      onClick={() => updateQty(item.productId, item.qty + 1)}
                      className="w-7 h-7 flex items-center justify-center font-bold text-ink hover:text-wine"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  <div className="flex items-center gap-4">
                    <span className="font-serif font-bold text-wine text-base sm:text-lg">
                      {formatPrice(
                        (item.pricePaise +
                          item.addOns.reduce((sum, a) => sum + a.pricePaise, 0)) *
                          item.qty
                      )}
                    </span>
                    <button
                      onClick={() => removeItem(item.productId)}
                      className="text-muted hover:text-error p-1 transition-colors"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {/* Handwritten Note Preview */}
            <div className="p-5 bg-white rounded-2xl border border-blush/80 space-y-2">
              <label className="text-xs font-bold text-wine uppercase tracking-wider flex items-center gap-1.5">
                <Sparkles className="w-3.5 h-3.5 text-gold" />
                <span>Calligraphy Wax-Sealed Note Card</span>
              </label>
              <textarea
                rows={2}
                value={giftMessage}
                onChange={(e) => setGiftMessage(e.target.value.slice(0, 250))}
                placeholder="Include your personal greeting here (optional)..."
                className="w-full p-3 rounded-xl border border-blush bg-cream text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-wine resize-none font-sans"
              />
              <span className="text-[11px] text-muted">
                {giftMessage.length} / 250 characters
              </span>
            </div>
          </div>

          {/* Right: Order Summary & Coupon */}
          <div className="lg:col-span-4 space-y-6">
            {/* Coupon Box */}
            <div className="p-5 bg-white rounded-2xl border border-blush/80 shadow-sm space-y-3">
              <label className="text-xs font-bold text-wine uppercase tracking-wider flex items-center gap-1.5">
                <Tag className="w-3.5 h-3.5 text-gold" />
                <span>Have a Promo Coupon?</span>
              </label>

              {couponCode && pricing?.appliedCoupon ? (
                <div className="p-3 rounded-xl bg-success/10 border border-success/30 flex items-center justify-between text-xs">
                  <div>
                    <span className="font-bold text-success font-mono">{couponCode}</span>
                    <p className="text-[11px] text-muted mt-0.5">
                      Discount applied: {formatPrice(pricing.appliedCoupon.discountPaise)}
                    </p>
                  </div>
                  <button
                    onClick={handleRemoveCoupon}
                    className="text-xs text-error font-semibold hover:underline"
                  >
                    Remove
                  </button>
                </div>
              ) : (
                <form onSubmit={handleApplyCoupon} className="flex gap-2">
                  <input
                    type="text"
                    value={couponInput}
                    onChange={(e) => setCouponInput(e.target.value.toUpperCase())}
                    placeholder="E.g. WELCOME10, DIWALI15"
                    className="flex-1 px-3.5 py-2 text-xs rounded-lg border border-blush bg-cream font-mono uppercase focus:outline-none focus:ring-1 focus:ring-wine"
                  />
                  <button
                    type="submit"
                    disabled={loading || !couponInput.trim()}
                    className="px-4 py-2 rounded-lg bg-wine text-white text-xs font-semibold hover:bg-wine-light transition-colors disabled:opacity-50"
                  >
                    Apply
                  </button>
                </form>
              )}

              {couponError && (
                <p className="text-xs text-error">{couponError}</p>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="p-6 bg-white rounded-2xl border border-blush/80 shadow-sm space-y-4">
              <h3 className="font-serif font-bold text-wine text-xl pb-2 border-b border-blush/50">
                Summary
              </h3>

              <div className="space-y-2.5 text-xs sm:text-sm text-ink/80">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-ink">
                    {pricing ? formatPrice(pricing.subtotalPaise) : formatPrice(0)}
                  </span>
                </div>

                {pricing && pricing.addOnsTotalPaise > 0 && (
                  <div className="flex justify-between">
                    <span>Add-ons Total</span>
                    <span className="font-semibold text-ink">
                      {formatPrice(pricing.addOnsTotalPaise)}
                    </span>
                  </div>
                )}

                {pricing && pricing.discountPaise > 0 && (
                  <div className="flex justify-between text-success font-semibold">
                    <span>Coupon Discount</span>
                    <span>-{formatPrice(pricing.discountPaise)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Pan-India Shipping</span>
                  <span className="font-semibold text-ink">
                    {pricing?.shippingPaise === 0 ? (
                      <span className="text-success font-bold">FREE</span>
                    ) : (
                      formatPrice(pricing?.shippingPaise || 9900)
                    )}
                  </span>
                </div>

                <div className="pt-3 border-t border-blush flex justify-between items-baseline">
                  <div>
                    <span className="font-serif font-bold text-wine text-lg sm:text-xl">
                      Total
                    </span>
                    <p className="text-[10px] text-muted">GST 100% Inclusive</p>
                  </div>
                  <span className="font-serif font-bold text-wine text-xl sm:text-2xl">
                    {pricing ? formatPrice(pricing.totalPaise) : formatPrice(0)}
                  </span>
                </div>
              </div>

              <Link
                href="/checkout"
                className="w-full py-3.5 rounded-pill bg-wine text-cream hover:bg-wine-light font-bold text-sm flex items-center justify-center gap-2 shadow-luxe transition-all"
              >
                <span>Proceed to Checkout</span>
                <ArrowRight className="w-4 h-4" />
              </Link>

              <div className="pt-2 text-center text-[11px] text-muted flex items-center justify-center gap-2">
                <ShieldCheck className="w-4 h-4 text-gold" />
                <span>Encrypted 256-bit Secure Checkout</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
