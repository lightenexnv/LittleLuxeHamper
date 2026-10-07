import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Package,
  ShoppingBag,
  Instagram,
  Tag,
  AlertTriangle,
  RefreshCw,
  ArrowRight,
  TrendingUp,
} from "lucide-react";
import { db } from "@/lib/db";
import { getAdminSession } from "@/lib/auth";
import { formatPrice } from "@/lib/money";

export default async function AdminDashboardPage() {
  const session = await getAdminSession();
  if (!session) redirect("/admin/login");

  // Fetch metrics
  const productsCount = await db.product.count();
  const sampleProductsCount = await db.product.count({ where: { isSample: true } });
  const ordersCount = await db.order.count();
  const confirmedOrders = await db.order.findMany({
    where: { paymentStatus: "PAID" },
    select: { total: true },
  });
  const totalRevenuePaise = confirmedOrders.reduce((sum, o) => sum + o.total, 0);

  const reelsCount = await db.reel.count();
  const enquiriesCount = await db.enquiry.count();

  // Recent 5 orders
  const recentOrders = await db.order.findMany({
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { items: true },
  });

  return (
    <div className="space-y-8 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-wine">
            Atelier Backoffice Dashboard
          </h1>
          <p className="text-xs text-muted mt-1">
            Welcome back, {session.email}. Here is what is happening across Little Luxe Hamper today.
          </p>
        </div>

        <form action="/api/admin/revalidate" method="POST">
          <button
            type="submit"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-white border border-blush/80 text-wine text-xs font-bold hover:bg-blush/30 shadow-sm transition-all"
          >
            <RefreshCw className="w-3.5 h-3.5 text-gold" />
            <span>Purge & Revalidate Cache</span>
          </button>
        </form>
      </div>

      {/* Metric Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <div className="p-6 rounded-3xl bg-white border border-blush/80 shadow-sm space-y-2">
          <span className="text-[11px] font-bold text-muted uppercase tracking-wider">
            Total Revenue (Paid)
          </span>
          <p className="font-serif font-bold text-2xl sm:text-3xl text-wine">
            {formatPrice(totalRevenuePaise)}
          </p>
          <span className="text-[11px] text-success font-semibold flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>From online store checkout</span>
          </span>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-blush/80 shadow-sm space-y-2">
          <span className="text-[11px] font-bold text-muted uppercase tracking-wider">
            Total Customer Orders
          </span>
          <p className="font-serif font-bold text-2xl sm:text-3xl text-wine">
            {ordersCount}
          </p>
          <Link href="/admin/orders" className="text-[11px] text-wine hover:underline font-semibold block">
            Manage orders &rarr;
          </Link>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-blush/80 shadow-sm space-y-2">
          <div className="flex justify-between items-center">
            <span className="text-[11px] font-bold text-muted uppercase tracking-wider">
              Hampers & Products
            </span>
            {sampleProductsCount > 0 && (
              <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-1.5 py-0.5 rounded">
                {sampleProductsCount} SAMPLE
              </span>
            )}
          </div>
          <p className="font-serif font-bold text-2xl sm:text-3xl text-wine">
            {productsCount}
          </p>
          <Link href="/admin/products" className="text-[11px] text-wine hover:underline font-semibold block">
            View & add products &rarr;
          </Link>
        </div>

        <div className="p-6 rounded-3xl bg-white border border-blush/80 shadow-sm space-y-2">
          <span className="text-[11px] font-bold text-muted uppercase tracking-wider">
            Instagram Reels Linked
          </span>
          <p className="font-serif font-bold text-2xl sm:text-3xl text-wine">
            {reelsCount}
          </p>
          <Link href="/admin/reels" className="text-[11px] text-wine hover:underline font-semibold block">
            Configure reels &rarr;
          </Link>
        </div>
      </div>

      {/* SAMPLE Items Replace Reminder Notice */}
      {sampleProductsCount > 0 && (
        <div className="p-6 rounded-3xl bg-amber-50 border border-amber-300 text-amber-900 space-y-2">
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0" />
            <h3 className="font-bold text-sm">Action Needed Before Public Launch</h3>
          </div>
          <p className="text-xs leading-relaxed">
            There are currently <strong>{sampleProductsCount} sample hampers</strong> marked with placeholder vector graphics in your catalogue. To make the store 100% production-ready, simply open each hamper in the <strong>Hampers</strong> tab and upload real photos and pricing, or uncheck the &ldquo;Is Sample&rdquo; toggle.
          </p>
        </div>
      )}

      {/* Recent Orders Section */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 border border-blush/80 shadow-sm space-y-4">
        <div className="flex items-center justify-between pb-3 border-b border-blush/50">
          <h2 className="font-serif font-bold text-wine text-xl">Recent Store Orders</h2>
          <Link href="/admin/orders" className="text-xs font-bold text-wine hover:underline">
            View All ({ordersCount}) &rarr;
          </Link>
        </div>

        {recentOrders.length === 0 ? (
          <p className="text-xs text-muted py-4 text-center">No orders placed yet.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="text-[10px] uppercase font-bold text-muted border-b border-blush/40">
                <tr>
                  <th className="py-2.5">Order</th>
                  <th className="py-2.5">Customer</th>
                  <th className="py-2.5">Status</th>
                  <th className="py-2.5">Payment</th>
                  <th className="py-2.5">Total</th>
                  <th className="py-2.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blush/30">
                {recentOrders.map((o) => (
                  <tr key={o.id} className="hover:bg-cream/40">
                    <td className="py-3 font-mono font-bold text-ink">{o.number}</td>
                    <td className="py-3">
                      <p className="font-semibold text-ink">{o.customerName}</p>
                      <p className="text-[10px] text-muted">{o.customerPhone}</p>
                    </td>
                    <td className="py-3">
                      <span className="px-2 py-0.5 rounded-full bg-blush text-wine font-semibold text-[10px]">
                        {o.status}
                      </span>
                    </td>
                    <td className="py-3 font-semibold text-[10px]">
                      {o.paymentStatus === "PAID" ? (
                        <span className="text-success font-bold">PAID ({o.paymentMethod})</span>
                      ) : (
                        <span className="text-amber-700">{o.paymentStatus} ({o.paymentMethod})</span>
                      )}
                    </td>
                    <td className="py-3 font-serif font-bold text-wine">{formatPrice(o.total)}</td>
                    <td className="py-3 text-right">
                      <Link
                        href="/admin/orders"
                        className="text-xs text-wine font-bold hover:underline"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
