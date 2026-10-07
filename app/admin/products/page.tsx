import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Trash2, Edit, ExternalLink, Sparkles, Package } from "lucide-react";
import { db } from "@/lib/db";
import { formatPrice } from "@/lib/money";
import { AdminProductsManager } from "@/components/admin/AdminProductsManager";

export const dynamic = "force-dynamic";

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

      <AdminProductsManager initialProducts={products as any} />
    </div>
  );
}
