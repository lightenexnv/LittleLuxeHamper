"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Building2, Sparkles, CheckCircle2, ShieldCheck, Mail, Phone, ArrowRight, Loader2 } from "lucide-react";
import { formatPrice } from "@/lib/money";

export default function CorporateGiftingPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [company, setCompany] = useState("");
  const [quantity, setQuantity] = useState("50");
  const [message, setMessage] = useState("");

  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const res = await fetch("/api/enquiry", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "corporate",
          name,
          email,
          phone,
          company,
          quantity: parseInt(quantity, 10) || 25,
          message,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        setErrorMsg("Failed to submit inquiry. Please try again or WhatsApp our corporate desk.");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-cream min-h-screen py-12 sm:py-20">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-bold text-gold uppercase tracking-widest flex items-center justify-center gap-1.5">
            <Building2 className="w-3.5 h-3.5" />
            <span>B2B & Bulk Executive Gifting</span>
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-wine mt-2">
            Elevate Your Corporate Gifting
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-3 leading-relaxed">
            From Diwali employee appreciation to premium executive onboarding hampers, our dedicated concierge team crafts bespoke gift solutions with custom branding and pan-India multi-location dispatch.
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          <div className="p-6 rounded-3xl bg-white border border-blush/80 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blush/60 text-wine flex items-center justify-center">
              <Sparkles className="w-6 h-6 text-gold" />
            </div>
            <h3 className="font-serif font-bold text-wine text-xl">Custom Logo Branding</h3>
            <p className="text-xs text-muted leading-relaxed font-sans">
              Hot-stamped foil logos on gift box lids, branded satin ribbons in your corporate palette, and company letterhead cards.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-blush/80 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blush/60 text-wine flex items-center justify-center">
              <Building2 className="w-6 h-6 text-wine" />
            </div>
            <h3 className="font-serif font-bold text-wine text-xl">Official GST Invoicing</h3>
            <p className="text-xs text-muted leading-relaxed font-sans">
              Seamless 100% compliant B2B tax invoices with your corporate GSTIN for easy input tax credit claims and purchase order processing.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-white border border-blush/80 shadow-sm space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-blush/60 text-wine flex items-center justify-center">
              <ShieldCheck className="w-6 h-6 text-gold" />
            </div>
            <h3 className="font-serif font-bold text-wine text-xl">Multi-Address Desk Delivery</h3>
            <p className="text-xs text-muted leading-relaxed font-sans">
              Share a simple spreadsheet: we dispatch individual tracking links directly to your employees and clients across 19,000+ pincodes.
            </p>
          </div>
        </div>

        {/* Form and Tiers Section */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 bg-white rounded-3xl p-6 sm:p-12 border border-blush/80 shadow-luxe">
          {/* Tiers Column */}
          <div className="lg:col-span-5 space-y-6">
            <span className="text-xs font-bold text-gold uppercase tracking-widest">
              Volume Pricing Tiers
            </span>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-wine">
              Tailored for Any Order Size
            </h2>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-cream border border-blush/70">
                <span className="text-xs font-bold text-wine">Tier 1 &bull; 25 to 99 Hampers</span>
                <p className="text-xs text-muted mt-1">
                  10% volume discount &bull; Complimentary calligraphy branding on cards &bull; Individual address shipping.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-cream border border-blush/70">
                <span className="text-xs font-bold text-wine">Tier 2 &bull; 100 to 499 Hampers</span>
                <p className="text-xs text-muted mt-1">
                  15% volume discount &bull; Custom gold foil logo on box lid &bull; Custom branded ribbons &bull; Priority production.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-cream border border-blush/70">
                <span className="text-xs font-bold text-wine">Tier 3 &bull; 500+ Hampers</span>
                <p className="text-xs text-muted mt-1">
                  20%+ bespoke pricing &bull; 100% custom product procurement &bull; Dedicated key account manager & real-time delivery dashboard.
                </p>
              </div>
            </div>

            <div className="p-4 rounded-2xl bg-blush/30 border border-blush/60 text-xs text-wine font-medium space-y-1">
              <p className="font-bold">Urgent Requirement?</p>
              <p className="text-muted">
                Reach our corporate concierge on WhatsApp:{" "}
                <a
                  href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210"}`}
                  className="text-wine font-bold underline"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  +91 {process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "9876543210"}
                </a>
              </p>
            </div>
          </div>

          {/* Enquiry Form Column */}
          <div className="lg:col-span-7 bg-cream p-6 sm:p-8 rounded-2xl border border-blush/80">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-success/20 text-success flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif font-bold text-wine text-2xl">
                  Enquiry Received!
                </h3>
                <p className="text-xs text-muted max-w-sm">
                  Our Corporate Concierge Lead will get in touch with a customized proposal and catalogue within 4 business hours.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-serif font-bold text-wine text-xl pb-2 border-b border-blush/50">
                  Request Corporate Catalogue & Quote
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-ink mb-1">Your Name *</label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="E.g. Rajesh Nair"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-blush bg-white focus:outline-none focus:ring-1 focus:ring-wine"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ink mb-1">Company / Organization *</label>
                    <input
                      type="text"
                      required
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Company Name"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-blush bg-white focus:outline-none focus:ring-1 focus:ring-wine"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-ink mb-1">Official Email *</label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="work@company.com"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-blush bg-white focus:outline-none focus:ring-1 focus:ring-wine"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ink mb-1">Mobile / WhatsApp *</label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="10-digit number"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-blush bg-white focus:outline-none focus:ring-1 focus:ring-wine font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink mb-1">Estimated Quantity</label>
                  <select
                    value={quantity}
                    onChange={(e) => setQuantity(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-blush bg-white focus:outline-none focus:ring-1 focus:ring-wine"
                  >
                    <option value="25">25 - 50 hampers</option>
                    <option value="100">50 - 150 hampers</option>
                    <option value="300">150 - 500 hampers</option>
                    <option value="1000">500+ hampers</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink mb-1">Details & Target Occasion / Date</label>
                  <textarea
                    rows={3}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about the occasion (Diwali, client gifts, onboarding), target budget per hamper, and delivery deadline..."
                    className="w-full p-3 text-xs rounded-xl border border-blush bg-white focus:outline-none focus:ring-1 focus:ring-wine resize-none font-sans"
                  />
                </div>

                {errorMsg && <p className="text-xs text-error font-semibold">{errorMsg}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-pill bg-wine text-cream hover:bg-wine-light font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Submit Corporate Enquiry</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
