import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Trash2, Edit, ExternalLink, Sparkles, Package } from "lucide-react";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/money";

export default async function AdminProductsPage() {
  const products = await db.product.findMany({
    include: {
      images: { orderBy: { sort: "asc" } },
      reels: true,
      collections: true,
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl font-bold text-wine">
            Hampers & Products Catalogue
          </h1>
          <p className="text-xs text-muted mt-1">
            Manage your boutique gifting inventory, image galleries, and linked Instagram reels.
          </p>
        </div>

        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-pill bg-wine text-white text-xs font-bold hover:bg-wine-light transition-all shadow-md w-fit"
        >
          <Plus className="w-4 h-4" />
          <span>Add New Hamper</span>
        </Link>
      </div>

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
                <th className="py-3 px-4">Sample?</th>
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
                          src={p.images[0]?.url || "/images/products/royal-velvet-anniversary-hamper-1.svg"}
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
                    <span className="font-serif font-bold text-wine text-sm">
                      {formatPrice(p.pricePaise)}
                    </span>
                    {p.mrpPaise > p.pricePaise && (
                      <span className="text-[10px] text-muted line-through block">
                        {formatPrice(p.mrpPaise)}
                      </span>
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
                    {p.isSample ? (
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
