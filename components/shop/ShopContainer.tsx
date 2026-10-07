"use client";

import React, { useState, useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { Search, Filter, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/ui/ProductCard";

export interface ShopProduct {
  id: string;
  slug: string;
  name: string;
  pricePaise: number;
  mrpPaise: number;
  isSample: boolean;
  needsReview?: boolean;
  isCustomizable: boolean;
  images: { url: string; alt: string }[];
  collections: { slug: string; name: string }[];
}

export function ShopContainer({
  products,
  collections,
}: {
  products: ShopProduct[];
  collections: { slug: string; name: string }[];
}) {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get("q") || "";
  const initialCollection = searchParams.get("collection") || "";

  const [query, setQuery] = useState(initialQuery);
  const [selectedCollection, setSelectedCollection] = useState(initialCollection);
  const [priceRange, setPriceRange] = useState<string>("all");
  const [customizableOnly, setCustomizableOnly] = useState(false);
  const [sortBy, setSortBy] = useState<string>("featured");
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Text search
    if (query.trim()) {
      const q = query.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.slug.toLowerCase().includes(q)
      );
    }

    // Collection filter
    if (selectedCollection) {
      result = result.filter((p) =>
        p.collections.some((c) => c.slug === selectedCollection)
      );
    }

    // Price range
    if (priceRange === "under-1500") {
      result = result.filter((p) => p.pricePaise <= 150000);
    } else if (priceRange === "1500-3000") {
      result = result.filter((p) => p.pricePaise > 150000 && p.pricePaise <= 300000);
    } else if (priceRange === "above-3000") {
      result = result.filter((p) => p.pricePaise > 300000);
    }

    // Customizable filter
    if (customizableOnly) {
      result = result.filter((p) => p.isCustomizable);
    }

    // Sorting
    if (sortBy === "price-asc") {
      result.sort((a, b) => a.pricePaise - b.pricePaise);
    } else if (sortBy === "price-desc") {
      result.sort((a, b) => b.pricePaise - a.pricePaise);
    }

    return result;
  }, [products, query, selectedCollection, priceRange, customizableOnly, sortBy]);

  return (
    <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-10">
      {/* Search & Mobile Filter Toggle Bar */}
      <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4 pb-8 border-b border-blush/60">
        <div className="relative flex-1 max-w-md">
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search within hampers..."
            className="w-full pl-10 pr-4 py-2.5 rounded-full border border-blush bg-white text-xs sm:text-sm focus:outline-none focus:ring-1 focus:ring-wine"
          />
          <Search className="w-4 h-4 text-muted absolute left-3.5 top-3" />
        </div>

        <div className="flex items-center justify-between gap-3">
          <button
            onClick={() => setMobileFilterOpen(!mobileFilterOpen)}
            className="md:hidden flex items-center gap-1.5 px-4 py-2 rounded-full border border-blush bg-white text-xs font-semibold text-wine"
          >
            <Filter className="w-3.5 h-3.5" />
            <span>Filters</span>
          </button>

          {/* Sort Selector */}
          <div className="flex items-center gap-2 text-xs">
            <span className="text-muted hidden sm:inline">Sort By:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-3 py-2 rounded-full border border-blush bg-white text-ink text-xs font-medium focus:outline-none focus:ring-1 focus:ring-wine"
            >
              <option value="featured">Featured Curations</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8 pt-8">
        {/* Desktop Sidebar Filters */}
        <aside
          className={`lg:col-span-1 space-y-6 ${
            mobileFilterOpen ? "block" : "hidden lg:block"
          }`}
        >
          <div className="p-5 rounded-2xl bg-white border border-blush/80 space-y-6 shadow-sm">
            <div className="flex items-center justify-between border-b border-blush/50 pb-3">
              <h3 className="font-serif font-bold text-wine text-base flex items-center gap-2">
                <SlidersHorizontal className="w-4 h-4" />
                <span>Filter Hampers</span>
              </h3>
              {(selectedCollection || priceRange !== "all" || customizableOnly || query) && (
                <button
                  onClick={() => {
                    setSelectedCollection("");
                    setPriceRange("all");
                    setCustomizableOnly(false);
                    setQuery("");
                  }}
                  className="text-[11px] text-rose-dark hover:underline font-semibold"
                >
                  Reset All
                </button>
              )}
            </div>

            {/* Collection Filter */}
            <div>
              <h4 className="text-xs font-bold text-ink uppercase tracking-wider mb-2.5">
                Occasion & Collection
              </h4>
              <div className="space-y-1.5 text-xs">
                <label className="flex items-center gap-2 cursor-pointer hover:text-wine">
                  <input
                    type="radio"
                    name="collection"
                    checked={selectedCollection === ""}
                    onChange={() => setSelectedCollection("")}
                    className="accent-wine"
                  />
                  <span>All Curations ({products.length})</span>
                </label>
                {collections.map((col) => (
                  <label
                    key={col.slug}
                    className="flex items-center gap-2 cursor-pointer hover:text-wine"
                  >
                    <input
                      type="radio"
                      name="collection"
                      checked={selectedCollection === col.slug}
                      onChange={() => setSelectedCollection(col.slug)}
                      className="accent-wine"
                    />
                    <span>{col.name}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* Price Filter */}
            <div>
              <h4 className="text-xs font-bold text-ink uppercase tracking-wider mb-2.5">
                Price Budget
              </h4>
              <div className="space-y-1.5 text-xs">
                <label className="flex items-center gap-2 cursor-pointer hover:text-wine">
                  <input
                    type="radio"
                    name="priceRange"
                    checked={priceRange === "all"}
                    onChange={() => setPriceRange("all")}
                    className="accent-wine"
                  />
                  <span>All Prices</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer hover:text-wine">
                  <input
                    type="radio"
                    name="priceRange"
                    checked={priceRange === "under-1500"}
                    onChange={() => setPriceRange("under-1500")}
                    className="accent-wine"
                  />
                  <span>Under ₹1,500</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer hover:text-wine">
                  <input
                    type="radio"
                    name="priceRange"
                    checked={priceRange === "1500-3000"}
                    onChange={() => setPriceRange("1500-3000")}
                    className="accent-wine"
                  />
                  <span>₹1,500 - ₹3,000</span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer hover:text-wine">
                  <input
                    type="radio"
                    name="priceRange"
                    checked={priceRange === "above-3000"}
                    onChange={() => setPriceRange("above-3000")}
                    className="accent-wine"
                  />
                  <span>₹3,000 & Above</span>
                </label>
              </div>
            </div>

            {/* Customisable Toggle */}
            <div className="border-t border-blush/40 pt-4">
              <label className="flex items-center gap-2 cursor-pointer text-xs font-medium text-ink hover:text-wine">
                <input
                  type="checkbox"
                  checked={customizableOnly}
                  onChange={(e) => setCustomizableOnly(e.target.checked)}
                  className="rounded text-wine accent-wine w-4 h-4"
                />
                <span>Customisable items only</span>
              </label>
            </div>
          </div>
        </aside>

        {/* Product Grid Area */}
        <main className="lg:col-span-3">
          <div className="mb-4 text-xs text-muted flex items-center justify-between">
            <span>Showing {filteredProducts.length} handcrafted hampers</span>
          </div>

          {filteredProducts.length === 0 ? (
            <div className="bg-white rounded-2xl p-12 text-center border border-blush/80">
              <p className="font-serif text-xl font-bold text-wine mb-2">
                No matching gift hampers found
              </p>
              <p className="text-xs text-muted mb-6">
                Try clearing your search query or adjusting your price filters.
              </p>
              <button
                onClick={() => {
                  setSelectedCollection("");
                  setPriceRange("all");
                  setCustomizableOnly(false);
                  setQuery("");
                }}
                className="px-6 py-2.5 rounded-pill bg-wine text-white text-xs font-semibold hover:bg-wine-light transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
              {filteredProducts.map((p) => (
                <ProductCard
                  key={p.id}
                  id={p.id}
                  slug={p.slug}
                  name={p.name}
                  pricePaise={p.pricePaise}
                  mrpPaise={p.mrpPaise}
                  isSample={p.isSample}
                  needsReview={p.needsReview}
                  images={p.images}
                />
              ))}
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
