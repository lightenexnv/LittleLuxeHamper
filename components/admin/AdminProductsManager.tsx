"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Plus, ExternalLink, AlertCircle, Check, Loader2, IndianRupee } from "lucide-react";
import { formatPrice } from "@/lib/money";

interface ProductItem {
  id: string;
  name: string;
  slug: string;
  sku: string;
  pricePaise: number;
  mrpPaise: number;
  stock: number;
  isSample: boolean;
  images: { url: string }[];
  reels: { shortcode: string }[];
}

export function AdminProductsManager({ initialProducts }: { initialProducts: ProductItem[] }) {
  const [products, setProducts] = useState(initialProducts);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editPrice, setEditPrice] = useState<string>("");
  const [savingId, setSavingId] = useState<string | null>(null);
  const [savedSuccess, setSavedSuccess] = useState<string | null>(null);

  const needsReviewProducts = products.filter((p) => p.pricePaise === 0);

  const handleStartEdit = (p: ProductItem) => {
    setEditingId(p.id);
    setEditPrice(p.pricePaise > 0 ? (p.pricePaise / 100).toString() : "");
  };

  const handleSavePrice = async (id: string) => {
    const numeric = parseFloat(editPrice);
    if (isNaN(numeric) || numeric < 0) {
      alert("Please enter a valid price in rupees");
      return;
    }
    const pricePaise = Math.round(numeric * 100);

    setSavingId(id);
    try {
      const res = await fetch(`/api/admin/products/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pricePaise, mrpPaise: Math.round(pricePaise * 1.15) }),
      });
      if (res.ok) {
        setProducts((prev) =>
          prev.map((item) => (item.id === id ? { ...item, pricePaise, mrpPaise: Math.round(pricePaise * 1.15) } : item))
        );
        setEditingId(null);
        setSavedSuccess(id);
        setTimeout(() => setSavedSuccess(null), 2500);
      } else {
        alert("Failed to update price");
      }
    } catch {
      alert("Error saving price");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-6">
      {/* Needs Review / Unpriced Bespoke Queue */}
      {needsReviewProducts.length > 0 && (
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-3xl p-6">
          <div className="flex items-center gap-2 mb-3 text-amber-800">
            <AlertCircle className="w-5 h-5 text-amber-600 shrink-0" />
            <h2 className="font-serif font-bold text-base">
              Needs Review Queue ({needsReviewProducts.length} unpriced bespoke hampers)
            </h2>
          </div>
          <p className="text-xs text-amber-900/80 mb-4">
            These authentic hampers are currently set to <strong>₹0 (Price on Request)</strong>. Customers will see an
            &quot;Enquire on WhatsApp&quot; button instead of Add to Cart until you set a fixed price below.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {needsReviewProducts.map((p) => (
              <div
                key={p.id}
                className="bg-white rounded-2xl p-4 border border-amber-200/60 shadow-sm flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className="relative w-12 h-14 rounded-lg overflow-hidden shrink-0 bg-cream border border-blush/60">
                    <Image
                      src={p.images[0]?.url || "/media/images/3944067240609796323_23802205442.webp"}
                      alt={p.name}
                      fill
                      sizes="48px"
                      className="object-cover"
                    />
                  </div>
                  <div className="min-w-0">
                    <p className="font-serif font-bold text-ink text-sm truncate">{p.name}</p>
                    <span className="inline-block mt-0.5 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 bg-amber-100 text-amber-800 rounded">
                      Needs Review
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {editingId === p.id ? (
                    <div className="flex items-center gap-1.5">
                      <div className="relative">
                        <IndianRupee className="w-3.5 h-3.5 text-muted absolute left-2.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="number"
                          placeholder="Price"
                          value={editPrice}
                          onChange={(e) => setEditPrice(e.target.value)}
                          className="w-24 pl-7 pr-2 py-1.5 text-xs rounded-lg border border-wine/40 bg-cream focus:outline-none focus:ring-1 focus:ring-wine"
                        />
                      </div>
                      <button
                        onClick={() => handleSavePrice(p.id)}
                        disabled={savingId === p.id}
                        className="px-3 py-1.5 bg-wine text-white text-xs font-bold rounded-lg hover:bg-wine-light disabled:opacity-50"
                      >
                        {savingId === p.id ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : "Save"}
                      </button>
                      <button
                        onClick={() => setEditingId(null)}
                        className="px-2 py-1.5 text-xs text-muted hover:text-ink"
                      >
                        Cancel
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => handleStartEdit(p)}
                      className="px-3 py-1.5 bg-amber-600 text-white text-xs font-bold rounded-xl hover:bg-amber-700 transition-colors shadow-sm"
                    >
                      Set Price
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Main Catalogue Table */}
      <div className="bg-white rounded-3xl border border-blush/80 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-cream/60 text-[10px] uppercase font-bold text-muted border-b border-blush/60">
              <tr>
                <th className="py-3 px-4">Hamper</th>
                <th className="py-3 px-4">SKU</th>
                <th className="py-3 px-4">Price / MRP</th>
                <th className="py-3 px-4">Stock</th>
                <th className="py-3 px-4">Reel Linked</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-blush/30">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-cream/30">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="relative w-12 h-14 rounded-lg overflow-hidden shrink-0 bg-cream border border-blush/60">
                        <Image
                          src={p.images[0]?.url || "/media/images/3944067240609796323_23802205442.webp"}
                          alt={p.name}
                          fill
                          sizes="48px"
                          className="object-cover"
                        />
                      </div>
                      <div>
                        <p className="font-serif font-bold text-ink text-sm">{p.name}</p>
                        <p className="text-[11px] text-muted">/{p.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono font-medium text-muted">{p.sku}</td>
                  <td className="py-3 px-4">
                    {editingId === p.id ? (
                      <div className="flex items-center gap-1.5">
                        <div className="relative">
                          <IndianRupee className="w-3 h-3 text-muted absolute left-2 top-1/2 -translate-y-1/2" />
                          <input
                            type="number"
                            value={editPrice}
                            onChange={(e) => setEditPrice(e.target.value)}
                            className="w-20 pl-6 pr-2 py-1 text-xs rounded border border-wine/40 bg-cream"
                          />
                        </div>
                        <button
                          onClick={() => handleSavePrice(p.id)}
                          className="px-2 py-1 bg-wine text-white text-[11px] font-bold rounded"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="group flex items-center gap-2 cursor-pointer" onClick={() => handleStartEdit(p)}>
                        <div>
                          {p.pricePaise === 0 ? (
                            <span className="font-semibold text-amber-600 text-xs">Price on Request</span>
                          ) : (
                            <span className="font-serif font-bold text-wine text-sm">
                              {formatPrice(p.pricePaise)}
                            </span>
                          )}
                          {p.mrpPaise > p.pricePaise && (
                            <span className="text-[10px] text-muted line-through block">
                              {formatPrice(p.mrpPaise)}
                            </span>
                          )}
                        </div>
                        {savedSuccess === p.id ? (
                          <Check className="w-3.5 h-3.5 text-success" />
                        ) : (
                          <span className="text-[10px] text-muted opacity-0 group-hover:opacity-100 transition-opacity underline">
                            edit
                          </span>
                        )}
                      </div>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span
                      className={`font-bold ${
                        p.stock > 5 ? "text-success" : p.stock > 0 ? "text-amber-600" : "text-error"
                      }`}
                    >
                      {p.stock} units
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {p.reels.length > 0 ? (
                      <span className="inline-flex items-center gap-1 text-[11px] text-rose-dark font-semibold">
                        <span>@{p.reels[0].shortcode}</span>
                      </span>
                    ) : (
                      <span className="text-muted text-[11px]">No reel</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {p.pricePaise === 0 ? (
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        NEEDS REVIEW
                      </span>
                    ) : p.isSample ? (
                      <span className="bg-amber-100 text-amber-800 text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        SAMPLE
                      </span>
                    ) : (
                      <span className="bg-success/15 text-success text-[10px] font-bold px-2 py-0.5 rounded uppercase">
                        LIVE
                      </span>
                    )}
                  </td>
                  <td className="py-3 px-4 text-right">
                    <div className="inline-flex items-center gap-2">
                      <Link
                        href={`/product/${p.slug}`}
                        target="_blank"
                        className="p-1.5 text-muted hover:text-wine rounded-lg hover:bg-cream"
                        title="View Live Page"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </Link>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
