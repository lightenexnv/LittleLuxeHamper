import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { CheckCircle2, Truck, Instagram, Calendar, ArrowRight, ShieldCheck, ExternalLink } from "lucide-react";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/money";

interface ConfirmationPageProps {
  params: {
    id: string;
  };
}

export const dynamic = "force-dynamic";

export default async function OrderConfirmationPage({ params }: ConfirmationPageProps) {
  const order = await db.order.findUnique({
    where: { id: params.id },
    include: {
      items: true,
      payments: true,
    },
  });

  if (!order) notFound();

  const address = (() => {
    try {
      return JSON.parse(order.address);
    } catch {
      return {};
    }
  })();

  const handle = process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || "little_luxehamper";
  const igUrl = `https://instagram.com/${handle}`;

  return (
    <div className="bg-cream min-h-screen py-12 sm:py-20">
      <div className="max-w-[760px] mx-auto px-4 sm:px-6">
        {/* Celebration Header */}
        <div className="bg-white rounded-3xl p-8 sm:p-12 border border-blush/80 shadow-luxe text-center space-y-4">
          <div className="w-16 h-16 rounded-full bg-success/15 text-success flex items-center justify-center mx-auto mb-2 animate-bounce">
            <CheckCircle2 className="w-9 h-9" />
          </div>

          <span className="text-xs font-bold text-gold uppercase tracking-widest">
            Celebration Confirmed
          </span>

          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-wine">
            Thank You, {order.customerName.split(" ")[0]}!
          </h1>

          <p className="text-sm text-ink/80 max-w-md mx-auto leading-relaxed">
            Your luxury hamper order has been placed successfully. Our master artisans are now preparing your gift with bespoke satin ribbons and handwritten wax-sealed notes.
          </p>

          <div className="inline-block px-4 py-2 rounded-full bg-cream border border-blush text-xs font-mono font-bold text-wine">
            Order Reference: {order.number}
          </div>

          {/* Timeline & ETA */}
          <div className="pt-6 border-t border-blush/60 grid grid-cols-1 sm:grid-cols-2 gap-4 text-left">
            <div className="p-4 rounded-2xl bg-cream border border-blush/60 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-wine">
                <Truck className="w-4 h-4 text-gold" />
                <span>Delivery Status</span>
              </div>
              <p className="text-xs text-ink/80 font-medium">
                Status: <strong className="text-wine">{order.status}</strong>
              </p>
              {order.deliveryDate ? (
                <p className="text-xs text-muted">
                  Target Date: <strong className="text-ink">{order.deliveryDate}</strong>
                </p>
              ) : (
                <p className="text-xs text-muted">Estimated arrival: 2-4 business days</p>
              )}
            </div>

            <div className="p-4 rounded-2xl bg-cream border border-blush/60 space-y-1">
              <div className="flex items-center gap-1.5 text-xs font-bold text-wine">
                <Calendar className="w-4 h-4 text-gold" />
                <span>Shipping Destination</span>
              </div>
              <p className="text-xs text-ink/80 font-medium truncate">
                {order.recipientName || order.customerName}
              </p>
              <p className="text-xs text-muted truncate">
                {address.city}, {address.state} - {address.pincode}
              </p>
            </div>
          </div>

          {/* Items Summary */}
          <div className="pt-6 border-t border-blush/60 text-left space-y-3">
            <h3 className="font-serif font-bold text-wine text-base">Hampers in This Order</h3>
            <div className="space-y-2">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="p-3 rounded-xl bg-cream/60 flex items-center justify-between text-xs"
                >
                  <div>
                    <p className="font-semibold text-ink">{item.nameSnapshot}</p>
                    <p className="text-[11px] text-muted">Quantity: {item.qty}</p>
                  </div>
                  <span className="font-bold text-wine">
                    {formatPrice(item.pricePaise * item.qty)}
                  </span>
                </div>
              ))}
            </div>

            <div className="pt-2 flex justify-between items-baseline font-serif font-bold text-wine text-base">
              <span>Total Paid (GST incl.)</span>
              <span>{formatPrice(order.total)}</span>
            </div>
          </div>

          {/* Instagram Follow Block */}
          <div className="pt-8 border-t border-blush/60 space-y-3">
            <h4 className="font-serif font-bold text-wine text-lg">
              Watch Your Hamper Being Styled
            </h4>
            <p className="text-xs text-muted max-w-sm mx-auto">
              We frequently showcase orders and ribbon wrapping on our Instagram feed. Tag us when unboxing!
            </p>
            <div>
              <a
                href={igUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-full text-white text-xs font-semibold shadow-sm transition-all hover:opacity-90"
                style={{
                  background: "linear-gradient(45deg, #F58529, #DD2A7B, #8134AF, #515BD4)",
                }}
              >
                <Instagram className="w-4 h-4" />
                <span>Follow @{handle}</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* Continue Shopping CTA */}
          <div className="pt-6">
            <Link
              href="/shop"
              className="inline-flex items-center gap-1.5 text-xs font-bold text-wine hover:text-gold-dark transition-colors"
            >
              <span>Explore More Curations</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
