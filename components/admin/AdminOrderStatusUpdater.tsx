"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Check, Loader2 } from "lucide-react";

export function AdminOrderStatusUpdater({
  orderId,
  currentStatus,
  currentAwb,
  currentTrackingUrl,
}: {
  orderId: string;
  currentStatus: string;
  currentAwb: string;
  currentTrackingUrl: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [awb, setAwb] = useState(currentAwb);
  const [trackingUrl, setTrackingUrl] = useState(currentTrackingUrl);
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleUpdate = async (newStatus: string) => {
    setStatus(newStatus);
    setLoading(true);

    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      if (res.ok) {
        setSaved(true);
        setTimeout(() => setSaved(false), 1500);
        router.refresh();
      }
    } catch {
      // Error
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-1.5">
      <select
        value={status}
        disabled={loading}
        onChange={(e) => handleUpdate(e.target.value)}
        className="w-full px-2.5 py-1.5 text-xs font-semibold rounded-lg border border-blush bg-white text-ink focus:outline-none focus:ring-1 focus:ring-wine"
      >
        <option value="PLACED">PLACED</option>
        <option value="CONFIRMED">CONFIRMED</option>
        <option value="PACKED">PACKED</option>
        <option value="SHIPPED">SHIPPED</option>
        <option value="OUT_FOR_DELIVERY">OUT FOR DELIVERY</option>
        <option value="DELIVERED">DELIVERED</option>
        <option value="CANCELLED">CANCELLED</option>
        <option value="FAILED">FAILED</option>
      </select>

      {loading && <span className="text-[10px] text-muted flex items-center gap-1"><Loader2 className="w-2.5 h-2.5 animate-spin"/> Updating...</span>}
      {saved && <span className="text-[10px] text-success font-bold flex items-center gap-1"><Check className="w-2.5 h-2.5"/> Updated</span>}
    </div>
  );
}
