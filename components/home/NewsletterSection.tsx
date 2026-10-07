"use client";

import React, { useState } from "react";
import { Mail, CheckCircle2 } from "lucide-react";

export function NewsletterSection() {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (res.ok) {
        setStatus("success");
        setEmail("");
      } else {
        setStatus("error");
      }
    } catch {
      setStatus("error");
    }
  };

  return (
    <section className="py-16 bg-white border-t border-blush/60">
      <div className="max-w-[700px] mx-auto px-4 sm:px-6 text-center">
        <div className="w-12 h-12 rounded-full bg-blush/60 text-wine flex items-center justify-center mx-auto mb-4">
          <Mail className="w-6 h-6" />
        </div>
        <h2 className="font-serif text-3xl font-bold text-wine">
          Receive 10% Off Your First Hamper
        </h2>
        <p className="text-xs sm:text-sm text-muted mt-2 max-w-md mx-auto">
          Subscribe to our private atelier newsletter for seasonal festival gift previews, VIP coupon codes, and unboxing inspirations.
        </p>

        {status === "success" ? (
          <div className="mt-6 p-4 rounded-xl bg-success/10 text-success text-sm font-medium flex items-center justify-center gap-2">
            <CheckCircle2 className="w-5 h-5" />
            <span>Thank you! Use coupon code <strong>WELCOME10</strong> at checkout for 10% off.</span>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="mt-6 flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email address"
              required
              className="flex-1 px-4 py-3 rounded-full border border-blush bg-cream text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-wine"
            />
            <button
              type="submit"
              disabled={status === "loading"}
              className="px-6 py-3 rounded-full bg-wine text-white text-xs sm:text-sm font-medium hover:bg-wine-light transition-colors shadow-sm disabled:opacity-50"
            >
              {status === "loading" ? "Subscribing..." : "Join VIP Club"}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
