"use client";

import React, { useState } from "react";
import { Search, PackageCheck, Truck, CheckCircle2, Clock, AlertCircle, ExternalLink, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/money";

interface TrackedOrder {
  id: string;
  number: string;
  status: string;
  paymentStatus: string;
  customerName: string;
  deliveryDate?: string;
  trackingUrl?: string;
  awb?: string;
  createdAt: string;
  total: number;
  itemsCount: number;
  events?: {
    status: string;
    activity: string;
    location: string;
    timestamp: string;
  }[];
}

const statusSteps = [
  "PLACED",
  "CONFIRMED",
  "PACKED",
  "SHIPPED",
  "OUT_FOR_DELIVERY",
  "DELIVERED",
];

export default function TrackOrderPage() {
  const [orderNumber, setOrderNumber] = useState("");
  const [phone, setPhone] = useState("");
  const [loading, setLoading] = useState(false);
  const [order, setOrder] = useState<TrackedOrder | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleTrack = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderNumber.trim() || !phone.trim()) {
      setError("Please provide both order number and phone number");
      return;
    }

    setLoading(true);
    setError(null);
    setOrder(null);

    try {
      const res = await fetch("/api/orders/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNumber, phone }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "Order not found");
      } else {
        setOrder(data.order);
      }
    } catch {
      setError("Unable to retrieve tracking details");
    } finally {
      setLoading(false);
    }
  };

  const getStepIndex = (status: string) => {
    return statusSteps.indexOf(status);
  };

  return (
    <div className="bg-cream min-h-screen py-12 sm:py-20">
      <div className="max-w-[760px] mx-auto px-4 sm:px-6">
        <div className="text-center mb-10">
          <span className="text-xs font-bold text-gold uppercase tracking-widest">
            Order Status
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl font-bold text-wine mt-1">
            Track Your Hamper
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-2 max-w-md mx-auto">
            Enter your order reference code and registered phone number to follow your gift from our atelier to their door.
          </p>
        </div>

        {/* Search Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-blush/80 shadow-sm mb-8">
          <form onSubmit={handleTrack} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1">
                  Order Number
                </label>
                <input
                  type="text"
                  required
                  value={orderNumber}
                  onChange={(e) => setOrderNumber(e.target.value)}
                  placeholder="E.g. LLH-2410-1234"
                  className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-blush bg-cream focus:outline-none focus:ring-1 focus:ring-wine font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1">
                  Registered Mobile Number
                </label>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="10-digit number"
                  className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-blush bg-cream focus:outline-none focus:ring-1 focus:ring-wine font-mono"
                />
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-xl bg-error/10 text-error text-xs font-semibold flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-pill bg-wine text-cream hover:bg-wine-light font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Searching Atelier Dispatch Records...</span>
                </>
              ) : (
                <>
                  <Search className="w-4 h-4" />
                  <span>Track Consignment</span>
                </>
              )}
            </button>
          </form>
        </div>

        {/* Results Timeline Card */}
        {order && (
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-blush/80 shadow-luxe space-y-6 animate-fade-in">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-blush/60 gap-2">
              <div>
                <span className="text-[11px] font-mono text-muted uppercase">
                  Order #{order.number}
                </span>
                <h3 className="font-serif font-bold text-wine text-xl">
                  {order.customerName}
                </h3>
              </div>
              <div className="text-right sm:text-right">
                <span className="text-xs font-bold px-3 py-1 rounded-full bg-blush text-wine">
                  Status: {order.status}
                </span>
                <p className="text-[11px] text-muted mt-1">
                  Placed on {new Date(order.createdAt).toLocaleDateString("en-IN")}
                </p>
              </div>
            </div>

            {/* Stepper Timeline Visual */}
            <div>
              <h4 className="text-xs font-bold text-ink uppercase tracking-wider mb-4">
                Progress Timeline
              </h4>
              <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 text-center text-[10px] font-bold">
                {statusSteps.map((step, idx) => {
                  const currentIdx = getStepIndex(order.status);
                  const isDone = currentIdx >= idx;
                  const isCurrent = currentIdx === idx;
                  return (
                    <div key={step} className="flex flex-col items-center">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center mb-1.5 transition-colors ${
                          isDone
                            ? "bg-wine text-white"
                            : "bg-blush/50 text-muted"
                        } ${isCurrent ? "ring-2 ring-gold" : ""}`}
                      >
                        {isDone ? (
                          <CheckCircle2 className="w-4 h-4" />
                        ) : (
                          <span>{idx + 1}</span>
                        )}
                      </div>
                      <span className={isDone ? "text-wine" : "text-muted"}>
                        {step.replace(/_/g, " ")}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Courier Tracking Link & AWB */}
            {order.awb && (
              <div className="p-4 rounded-2xl bg-cream border border-blush/60 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                <div>
                  <p className="font-bold text-wine">Courier Consignment AWB: {order.awb}</p>
                  <p className="text-[11px] text-muted">Dispatched via Express Courier Network</p>
                </div>
                {order.trackingUrl && (
                  <a
                    href={order.trackingUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 px-4 py-2 rounded-pill bg-wine text-white font-semibold hover:bg-wine-light transition-colors w-fit"
                  >
                    <span>Courier Live Tracking</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            )}

            {/* Detailed Scans */}
            {order.events && order.events.length > 0 && (
              <div className="pt-2 border-t border-blush/50 space-y-3">
                <h4 className="text-xs font-bold text-ink uppercase tracking-wider">
                  Live Dispatch Scans
                </h4>
                <div className="space-y-2">
                  {order.events.map((evt, i) => (
                    <div
                      key={i}
                      className="p-3 rounded-xl bg-cream/60 flex items-start justify-between text-xs gap-3"
                    >
                      <div className="flex items-start gap-2">
                        <Truck className="w-4 h-4 text-wine shrink-0 mt-0.5" />
                        <div>
                          <p className="font-semibold text-ink">{evt.activity}</p>
                          <p className="text-[11px] text-muted">{evt.location}</p>
                        </div>
                      </div>
                      <span className="text-[11px] text-muted shrink-0 font-mono">
                        {new Date(evt.timestamp).toLocaleDateString("en-IN", {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
