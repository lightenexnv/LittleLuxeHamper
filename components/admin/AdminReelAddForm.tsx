"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus, Instagram, Loader2, Check } from "lucide-react";

export function AdminReelAddForm({
  products,
}: {
  products: { id: string; name: string }[];
}) {
  const router = useRouter();
  const [instagramUrl, setInstagramUrl] = useState("");
  const [posterUrl, setPosterUrl] = useState("/images/reels/poster-C8xyz1.svg");
  const [caption, setCaption] = useState("");
  const [productId, setProductId] = useState("");
  const [showOnHome, setShowOnHome] = useState(true);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/admin/reels", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          instagramUrl,
          posterUrl,
          caption,
          productId: productId || null,
          showOnHome,
        }),
      });

      if (res.ok) {
        setSuccess(true);
        setInstagramUrl("");
        setCaption("");
        setTimeout(() => setSuccess(false), 2000);
        router.refresh();
      } else {
        const data = await res.json();
        setError(data.error || "Failed to create reel");
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
        <span>Add New Instagram Reel</span>
      </h2>

      {error && <div className="text-xs text-error font-semibold">{error}</div>}
      {success && <div className="text-xs text-success font-semibold flex items-center gap-1"><Check className="w-4 h-4"/> Reel added successfully!</div>}

      <form onSubmit={handleSubmit} className="space-y-4 text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-ink mb-1">Instagram Reel Link *</label>
            <input
              type="url"
              required
              value={instagramUrl}
              onChange={(e) => setInstagramUrl(e.target.value)}
              placeholder="https://www.instagram.com/reel/C8xyz1/"
              className="w-full px-3.5 py-2.5 rounded-xl border border-blush bg-cream focus:outline-none focus:ring-1 focus:ring-wine"
            />
          </div>

          <div>
            <label className="block font-bold text-ink mb-1">Local Poster Image URL *</label>
            <input
              type="text"
              required
              value={posterUrl}
              onChange={(e) => setPosterUrl(e.target.value)}
              placeholder="/images/reels/poster-C8xyz1.svg"
              className="w-full px-3.5 py-2.5 rounded-xl border border-blush bg-cream focus:outline-none focus:ring-1 focus:ring-wine font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-bold text-ink mb-1">Reel Caption / Overlay Text *</label>
            <input
              type="text"
              required
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
              placeholder="E.g. Packing our Royal Velvet anniversary box with silk satin ribbon ✨"
              className="w-full px-3.5 py-2.5 rounded-xl border border-blush bg-cream focus:outline-none focus:ring-1 focus:ring-wine"
            />
          </div>

          <div>
            <label className="block font-bold text-ink mb-1">Link to Hamper (Optional)</label>
            <select
              value={productId}
              onChange={(e) => setProductId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-blush bg-cream focus:outline-none focus:ring-1 focus:ring-wine"
            >
              <option value="">No linked product</option>
              {products.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex items-center justify-between pt-2">
          <label className="flex items-center gap-2 cursor-pointer text-ink font-semibold">
            <input
              type="checkbox"
              checked={showOnHome}
              onChange={(e) => setShowOnHome(e.target.checked)}
              className="rounded accent-wine w-4 h-4"
            />
            <span>Show on Landing Page marquee strip</span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="px-6 py-2.5 rounded-pill bg-wine text-white font-bold hover:bg-wine-light transition-all flex items-center gap-1.5 shadow-sm disabled:opacity-50"
          >
            {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
            <span>Save Reel</span>
          </button>
        </div>
      </form>
    </div>
  );
}
