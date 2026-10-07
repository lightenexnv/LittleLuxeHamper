"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Tag, Loader2, Check } from "lucide-react";

export function AdminCouponAddForm() {
  const router = useRouter();
  const [code, setCode] = useState("");
  const [type, setType] = useState<"PERCENT" | "FLAT">("PERCENT");
  const [value, setValue] = useState("10");
  const [minOrderRupees, setMinOrderRupees] = useState("999");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const parsedValue = parseInt(value, 10);
      const minOrderPaise = Math.round(parseFloat(minOrderRupees) * 100);

      const res = await fetch("/api/admin/coupons", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: code.trim().toUpperCase(),
          type,
          value: type === "PERCENT" ? parsedValue : parsedValue * 100,
          minOrder: minOrderPaise,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setCode("");
        setTimeout(() => setSuccess(false), 2000);
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to create coupon");
      }
    } catch {
      setError("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-blush/80 shadow-sm space-y-4">
      <h2 className="font-serif font-bold text-wine text-xl flex items-center gap-2">
        <Plus className="w-5 h-5 text-gold" />
        <span>Create New Coupon Code</span>
      </h2>

      {error && <div className="text-xs text-error font-semibold">{error}</div>}
      {success && <div className="text-xs text-success font-semibold flex items-center gap-1"><Check className="w-4 h-4"/> Coupon created!</div>}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
          <div>
            <label className="block font-bold text-ink mb-1">Coupon Code *</label>
            <input
              type="text"
              required
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="E.g. DIWALI20"
              className="w-full px-3.5 py-2.5 rounded-xl border border-blush bg-cream font-mono uppercase"
            />
          </div>

          <div>
            <label className="block font-bold text-ink mb-1">Discount Type</label>
            <select
              value={type}
              onChange={(e) => setType(e.target.value as "PERCENT" | "FLAT")}
              className="w-full px-3.5 py-2.5 rounded-xl border border-blush bg-cream"
            >
              <option value="PERCENT">Percentage (%)</option>
              <option value="FLAT">Flat Rupee (₹)</option>
            </select>
          </div>

          <div>
            <label className="block font-bold text-ink mb-1">
              Discount Value {type === "PERCENT" ? "(%)" : "(₹)"} *
            </label>
            <input
              type="number"
              required
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-blush bg-cream font-mono"
            />
          </div>

          <div>
            <label className="block font-bold text-ink mb-1">Min Order Cart (₹) *</label>
            <input
              type="number"
              required
              value={minOrderRupees}
              onChange={(e) => setMinOrderRupees(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-blush bg-cream font-mono"
            />
          </div>
        </div>

        <div className="flex justify-end pt-2">
          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-pill bg-wine text-white font-bold hover:bg-wine-light transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50"
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>Create Coupon</span>
          </button>
        </div>
      </form>
    </div>
  );
}
