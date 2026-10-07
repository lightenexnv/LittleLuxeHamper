"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Instagram, MessageCircle, Send, CheckCircle2, Loader2 } from "lucide-react";
import { trackWhatsAppClick } from "@/lib/analytics";

export default function ContactPage() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
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
          type: "contact",
          name,
          email,
          phone,
          message,
        }),
      });

      if (res.ok) {
        setSubmitted(true);
      } else {
        setErrorMsg("Failed to send message. Please try again or reach us via WhatsApp.");
      }
    } catch {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const waNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210";
  const igHandle = process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || "little_luxehamper";

  return (
    <div className="bg-cream min-h-screen py-12 sm:py-20">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-xs font-bold text-gold uppercase tracking-widest">
            Always Here To Assist
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-wine mt-2">
            Contact Concierge
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-2">
            Have a question about target delivery dates, custom hampers, or order status? We are delighted to assist.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Direct channels */}
          <div className="lg:col-span-5 space-y-6">
            {/* WhatsApp Highlight Box */}
            <div className="p-6 rounded-3xl bg-white border border-blush/80 shadow-sm space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-[#25D366]/20 text-[#25D366] flex items-center justify-center">
                <MessageCircle className="w-6 h-6 fill-current" />
              </div>
              <h3 className="font-serif font-bold text-wine text-xl">
                Fastest Response: WhatsApp Concierge
              </h3>
              <p className="text-xs text-muted leading-relaxed font-sans">
                Chat directly with our gift curation team for immediate delivery timeline confirmations, customization requests, and unboxing photos.
              </p>
              <a
                href={`https://wa.me/${waNumber}?text=Hello%20Little%20Luxe%20Hamper!%20I%20need%20assistance.`}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackWhatsAppClick("contact_page_highlight")}
                className="inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#25D366] hover:bg-[#20BA5A] text-white text-xs font-bold transition-all shadow-sm"
              >
                <span>Chat on WhatsApp</span>
                <Phone className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Other Channels */}
            <div className="p-6 rounded-3xl bg-white border border-blush/80 shadow-sm space-y-4 text-xs">
              <div className="flex items-start gap-3">
                <Mail className="w-5 h-5 text-wine shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-ink">Concierge Email</p>
                  <p className="text-muted">concierge@littleluxehamper.com</p>
                  <p className="text-[11px] text-muted">Response within 4 business hours</p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-blush/40">
                <Instagram className="w-5 h-5 text-rose-dark shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-ink">Instagram Direct Message</p>
                  <a
                    href={`https://instagram.com/${igHandle}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-wine font-semibold hover:underline"
                  >
                    @{igHandle}
                  </a>
                  <p className="text-[11px] text-muted">Daily reels, unboxings and customer stories</p>
                </div>
              </div>

              <div className="flex items-start gap-3 pt-3 border-t border-blush/40">
                <MapPin className="w-5 h-5 text-gold shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold text-ink">Atelier Studio & Dispatch Hub</p>
                  <p className="text-muted">Little Luxe Hamper Atelier</p>
                  <p className="text-muted">Indiranagar, Bengaluru, Karnataka 560038, India</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Message Form */}
          <div className="lg:col-span-7 bg-white rounded-3xl p-6 sm:p-10 border border-blush/80 shadow-luxe">
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center p-6 space-y-4">
                <div className="w-16 h-16 rounded-full bg-success/20 text-success flex items-center justify-center">
                  <CheckCircle2 className="w-8 h-8" />
                </div>
                <h3 className="font-serif font-bold text-wine text-2xl">
                  Message Sent With Grace
                </h3>
                <p className="text-xs text-muted max-w-sm">
                  Thank you for writing to our atelier. Our concierge team will reply to your email or WhatsApp promptly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <h3 className="font-serif font-bold text-wine text-2xl pb-2 border-b border-blush/50">
                  Send a Direct Note
                </h3>

                <div>
                  <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="E.g. Gayatri Sharma"
                    className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-blush bg-cream focus:outline-none focus:ring-1 focus:ring-wine"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@domain.com"
                      className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-blush bg-cream focus:outline-none focus:ring-1 focus:ring-wine"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1">
                      Mobile Number (+91) *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="98765 43210"
                      className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-blush bg-cream focus:outline-none focus:ring-1 focus:ring-wine font-mono"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-ink uppercase tracking-wider mb-1">
                    How Can We Assist You? *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Tell us about your event, delivery date question, or feedback..."
                    className="w-full p-3 text-xs sm:text-sm rounded-xl border border-blush bg-cream focus:outline-none focus:ring-1 focus:ring-wine resize-none font-sans"
                  />
                </div>

                {errorMsg && <p className="text-xs text-error font-semibold">{errorMsg}</p>}

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full py-3.5 rounded-pill bg-wine text-cream hover:bg-wine-light font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-sm transition-all disabled:opacity-50"
                >
                  {loading && <Loader2 className="w-4 h-4 animate-spin" />}
                  <span>Send Concierge Message</span>
                  <Send className="w-4 h-4" />
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
