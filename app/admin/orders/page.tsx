import React from "react";
import { Download, ShoppingBag, Truck, ExternalLink, Calendar } from "lucide-react";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/money";
import { AdminOrderStatusUpdater } from "@/components/admin/AdminOrderStatusUpdater";

export default async function AdminOrdersPage() {
  const orders = await db.order.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      items: true,
      payments: true,
    },
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-wine">
            Customer Orders & Fulfillment
          </h1>
          <p className="text-xs text-muted mt-1">
            Track incoming purchases, update fulfillment statuses, and manage courier tracking links.
          </p>
        </div>

        <a
          href="/api/admin/orders/export"
          className="inline-flex items-center gap-1.5 px-4 py-2.5 rounded-xl bg-white border border-blush text-wine text-xs font-bold hover:bg-blush/30 shadow-sm transition-all w-fit"
        >
          <Download className="w-4 h-4 text-gold" />
          <span>Export All Orders to CSV</span>
        </a>
      </div>

      <div className="bg-white rounded-3xl border border-blush/80 shadow-sm overflow-hidden">
        {orders.length === 0 ? (
          <div className="p-12 text-center text-muted">
            <ShoppingBag className="w-10 h-10 mx-auto text-rose/40 mb-2" />
            <p className="font-serif font-bold text-wine text-base">No orders in database yet</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-cream/60 text-[10px] uppercase font-bold text-muted border-b border-blush/60">
                <tr>
                  <th className="py-3 px-4">Order Details</th>
                  <th className="py-3 px-4">Customer & Contact</th>
                  <th className="py-3 px-4">Delivery Date / Dest</th>
                  <th className="py-3 px-4">Amount & Payment</th>
                  <th className="py-3 px-4">Fulfillment Status</th>
                  <th className="py-3 px-4">Courier / AWB</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-blush/30">
                {orders.map((o) => {
                  const address = (() => {
                    try {
                      return JSON.parse(o.address);
                    } catch {
                      return {};
                    }
                  })();

                  return (
                    <tr key={o.id} className="hover:bg-cream/30">
                      <td className="py-4 px-4 align-top">
                        <span className="font-mono font-bold text-ink block text-xs">
                          {o.number}
                        </span>
                        <span className="text-[10px] text-muted">
                          {new Date(o.createdAt).toLocaleDateString("en-IN", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })}
                        </span>
                        <div className="mt-1 text-[11px] text-muted">
                          {o.items.map((i) => (
                            <div key={i.id} className="truncate max-w-[180px]">
                              {i.qty}x {i.nameSnapshot}
                            </div>
                          ))}
                        </div>
                      </td>

                      <td className="py-4 px-4 align-top">
                        <p className="font-bold text-ink">{o.customerName}</p>
                        <p className="text-[11px] text-muted">{o.customerPhone}</p>
                        <p className="text-[10px] text-muted">{o.customerEmail}</p>
                        {o.giftMessage && (
                          <div className="mt-1.5 p-1.5 rounded-lg bg-cream border border-blush/60 text-[10px] text-ink/80 italic max-w-xs">
                            &ldquo;{o.giftMessage}&rdquo;
                          </div>
                        )}
                      </td>

                      <td className="py-4 px-4 align-top">
                        <p className="font-semibold text-ink">
                          {address.city || "India"}, {address.state || ""}
                        </p>
                        <p className="text-[10px] text-muted font-mono">{address.pincode}</p>
                        {o.deliveryDate ? (
                          <p className="text-[11px] text-rose-dark font-semibold mt-1 flex items-center gap-1">
                            <Calendar className="w-3 h-3" />
                            <span>Target: {o.deliveryDate}</span>
                          </p>
                        ) : (
                          <p className="text-[10px] text-muted mt-1">Standard 2-4 days</p>
                        )}
                      </td>

                      <td className="py-4 px-4 align-top">
                        <span className="font-serif font-bold text-wine text-sm block">
                          {formatPrice(o.total)}
                        </span>
                        <span className="text-[10px] font-semibold text-muted">
                          Method: {o.paymentMethod}
                        </span>
                        <div>
                          {o.paymentStatus === "PAID" ? (
                            <span className="inline-block px-1.5 py-0.5 rounded bg-success/15 text-success font-bold text-[9px]">
                              PAID
                            </span>
                          ) : (
                            <span className="inline-block px-1.5 py-0.5 rounded bg-amber-100 text-amber-800 font-bold text-[9px]">
                              {o.paymentStatus}
                            </span>
                          )}
                        </div>
                      </td>

                      <td className="py-4 px-4 align-top">
                        <AdminOrderStatusUpdater
                          orderId={o.id}
                          currentStatus={o.status}
                          currentAwb={o.awb || ""}
                          currentTrackingUrl={o.trackingUrl || ""}
                        />
                      </td>

                      <td className="py-4 px-4 align-top">
                        {o.awb ? (
                          <div className="space-y-1">
                            <span className="font-mono text-[11px] font-bold text-ink block">
                              {o.awb}
                            </span>
                            {o.trackingUrl && (
                              <a
                                href={o.trackingUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-[10px] text-wine hover:underline flex items-center gap-1"
                              >
                                <span>Track Consignment</span>
                                <ExternalLink className="w-2.5 h-2.5" />
                              </a>
                            )}
                          </div>
                        ) : (
                          <span className="text-muted text-[11px]">Unassigned</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
