import React from "react";
import { Tag, Plus, CheckCircle2 } from "lucide-react";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/money";
import { AdminCouponAddForm } from "@/components/admin/AdminCouponAddForm";

export default async function AdminCouponsPage() {
  const coupons = await db.coupon.findMany({
    orderBy: { code: "asc" },
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div>
        <h1 className="font-serif text-3xl font-bold text-wine">
          Discount Coupons & Offers
        </h1>
        <p className="text-xs text-muted mt-1">
          Create percentage or flat rupee discounts for festivals, cart abandoners, and VIP newsletters.
        </p>
      </div>

      <AdminCouponAddForm />

      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-blush/80 shadow-sm space-y-4">
        <h2 className="font-serif font-bold text-wine text-xl pb-2 border-b border-blush/50">
          Active Coupons ({coupons.length})
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
          {coupons.map((c) => (
            <div
              key={c.id}
              className="p-5 rounded-2xl bg-cream border border-blush/70 space-y-2 text-xs"
            >
              <div className="flex items-center justify-between">
                <span className="font-mono font-bold text-wine text-base bg-white px-2 py-0.5 rounded-md border border-blush/60">
                  {c.code}
                </span>
                <span className="text-[10px] bg-success/15 text-success font-bold px-2 py-0.5 rounded-full">
                  ACTIVE
                </span>
              </div>

              <p className="font-bold text-ink">
                {c.type === "PERCENT"
                  ? `${c.value}% OFF entire cart`
                  : `${formatPrice(c.value)} FLAT discount`}
              </p>

              <p className="text-muted text-[11px]">
                Min Order: {formatPrice(c.minOrder)}
              </p>

              <p className="text-muted text-[11px]">
                Times Used: {c.usedCount}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
