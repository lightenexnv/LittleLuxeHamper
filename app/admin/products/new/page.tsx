"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Save, Loader2, Sparkles, Instagram, Image as ImageIcon } from "lucide-react";

export default function NewProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Form states
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [shortDesc, setShortDesc] = useState("");
  const [description, setDescription] = useState("");
  const [priceRupees, setPriceRupees] = useState("2499");
  const [mrpRupees, setMrpRupees] = useState("2999");
  const [sku, setSku] = useState("");
  const [stock, setStock] = useState("20");
  const [isCustomizable, setIsCustomizable] = useState(false);
  const [isSample, setIsSample] = useState(false);
  const [contentsRaw, setContentsRaw] = useState(
    "Handmade Scented Soy Candle in Amber Jar\nBelgian Dark Chocolate Rochers (Box of 4)\nGold Foil Calligraphy Greeting Card\nSignature Rigid Satin Ribbon Gift Box"
  );
  const [tags, setTags] = useState("bestseller,gift,luxury");

  // Images
  const [imageUrl1, setImageUrl1] = useState("/images/products/royal-velvet-anniversary-hamper-1.svg");
  const [imageUrl2, setImageUrl2] = useState("/images/products/royal-velvet-anniversary-hamper-2.svg");

  // Reel
  const [hasReel, setHasReel] = useState(true);
  const [reelUrl, setReelUrl] = useState("https://www.instagram.com/reel/C8xyz1/");
  const [reelPosterUrl, setReelPosterUrl] = useState("/images/reels/poster-C8xyz1.svg");
  const [reelCaption, setReelCaption] = useState("Watch our artisans hand-tie this bespoke hamper bow ✨");
  const [reelShowOnHome, setReelShowOnHome] = useState(true);

  // Auto generate slug from name
  const handleNameChange = (val: string) => {
    setName(val);
    const generatedSlug = val
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    setSlug(generatedSlug);
    if (!sku) {
      setSku(`LLH-${generatedSlug.slice(0, 6).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg(null);

    try {
      const contents = contentsRaw
        .split("\n")
        .map((s) => s.trim())
        .filter(Boolean);

      const pricePaise = Math.round(parseFloat(priceRupees) * 100);
      const mrpPaise = Math.round(parseFloat(mrpRupees) * 100);

      const images = [
        { url: imageUrl1, alt: name, sort: 0 },
        ...(imageUrl2 ? [{ url: imageUrl2, alt: `${name} open box`, sort: 1 }] : []),
      ];

      const payload = {
        name,
        slug,
        shortDesc,
        description,
        pricePaise,
        mrpPaise,
        sku,
        stock: parseInt(stock, 10) || 10,
        isCustomizable,
        isActive: true,
        isSample,
        contents,
        tags,
        images,
        ...(hasReel && reelUrl && reelPosterUrl
          ? {
              reelUrl,
              reelPosterUrl,
              reelCaption,
              reelShowOnHome,
            }
          : {}),
      };

      const res = await fetch("/api/admin/products", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMsg(data.error || "Failed to create product");
      } else {
        router.push("/admin/products");
        router.refresh();
      }
    } catch {
      setErrorMsg("Network error occurred");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      <div className="flex items-center justify-between">
        <Link
          href="/admin/products"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-wine hover:underline"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Catalogue</span>
        </Link>
      </div>

      <div className="bg-white rounded-3xl p-6 sm:p-10 border border-blush/80 shadow-sm space-y-6">
        <div>
          <h1 className="font-serif text-2xl sm:text-3xl font-bold text-wine">
            Add New Boutique Hamper
          </h1>
          <p className="text-xs text-muted mt-1">
            Publish a new curated gift box complete with image gallery and Instagram reel integration.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3.5 rounded-xl bg-error/10 text-error text-xs font-semibold">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* General info */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-ink mb-1">Hamper Title *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => handleNameChange(e.target.value)}
                placeholder="E.g. Emerald Forest Pamper Box"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-blush bg-cream focus:outline-none focus:ring-1 focus:ring-wine"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-ink mb-1">URL Slug *</label>
              <input
                type="text"
                required
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                placeholder="emerald-forest-pamper-box"
                className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-blush bg-cream focus:outline-none focus:ring-1 focus:ring-wine font-mono"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-ink mb-1">Short Description (PDP Top Summary) *</label>
            <input
              type="text"
              required
              value={shortDesc}
              onChange={(e) => setShortDesc(e.target.value)}
              placeholder="E.g. Refreshing botanical spa hamper with forest bath salts and silk mask."
              className="w-full px-3.5 py-2.5 text-xs sm:text-sm rounded-xl border border-blush bg-cream focus:outline-none focus:ring-1 focus:ring-wine"
            />
          </div>

          <div>
            <label className="block text-xs font-bold text-ink mb-1">Full Editorial Description *</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Deep storytelling about the inspiration, scent notes, and packaging..."
              className="w-full p-3 text-xs sm:text-sm rounded-xl border border-blush bg-cream focus:outline-none focus:ring-1 focus:ring-wine resize-none font-sans"
            />
          </div>

          {/* Pricing & Inventory */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4 pt-2 border-t border-blush/40">
            <div>
              <label className="block text-xs font-bold text-ink mb-1">Selling Price (₹) *</label>
              <input
                type="number"
                required
                value={priceRupees}
                onChange={(e) => setPriceRupees(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-blush bg-cream font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-ink mb-1">MRP Strike (₹) *</label>
              <input
                type="number"
                required
                value={mrpRupees}
                onChange={(e) => setMrpRupees(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-blush bg-cream font-mono"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-ink mb-1">SKU Code *</label>
              <input
                type="text"
                required
                value={sku}
                onChange={(e) => setSku(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-blush bg-cream font-mono uppercase"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-ink mb-1">Initial Stock *</label>
              <input
                type="number"
                required
                value={stock}
                onChange={(e) => setStock(e.target.value)}
                className="w-full px-3.5 py-2 text-xs rounded-xl border border-blush bg-cream font-mono"
              />
            </div>
          </div>

          {/* Contents list */}
          <div>
            <label className="block text-xs font-bold text-ink mb-1">
              Hamper Items (One Item Per Line) *
            </label>
            <textarea
              rows={4}
              required
              value={contentsRaw}
              onChange={(e) => setContentsRaw(e.target.value)}
              className="w-full p-3 text-xs rounded-xl border border-blush bg-cream font-mono resize-none"
            />
          </div>

          {/* Toggles */}
          <div className="flex flex-wrap gap-6 pt-2 border-t border-blush/40 text-xs font-semibold text-ink">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isCustomizable}
                onChange={(e) => setIsCustomizable(e.target.checked)}
                className="rounded accent-wine w-4 h-4"
              />
              <span>Can be customized / personalized</span>
            </label>

            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={isSample}
                onChange={(e) => setIsSample(e.target.checked)}
                className="rounded accent-wine w-4 h-4"
              />
              <span>Flag as SAMPLE Item (Replace before official launch)</span>
            </label>
          </div>

          {/* Images */}
          <div className="space-y-3 pt-2 border-t border-blush/40">
            <h3 className="font-serif font-bold text-wine text-base flex items-center gap-2">
              <ImageIcon className="w-4 h-4" />
              <span>Product Image URLs</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-[11px] font-semibold text-muted mb-1">Primary Image (Front Shot)</label>
                <input
                  type="text"
                  required
                  value={imageUrl1}
                  onChange={(e) => setImageUrl1(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-blush bg-cream font-mono"
                />
              </div>

              <div>
                <label className="block text-[11px] font-semibold text-muted mb-1">Secondary Image (Unboxing / Detail Shot)</label>
                <input
                  type="text"
                  value={imageUrl2}
                  onChange={(e) => setImageUrl2(e.target.value)}
                  className="w-full px-3.5 py-2 text-xs rounded-xl border border-blush bg-cream font-mono"
                />
              </div>
            </div>
          </div>

          {/* Instagram Reel Field (Auto-parsed shortcode) */}
          <div className="space-y-4 pt-2 border-t border-blush/40 p-4 rounded-2xl bg-cream border border-blush/70">
            <div className="flex items-center justify-between">
              <h3 className="font-serif font-bold text-wine text-base flex items-center gap-2">
                <Instagram className="w-4 h-4 text-rose-dark" />
                <span>Link Instagram Reel To This Hamper</span>
              </h3>
              <label className="flex items-center gap-2 text-xs font-semibold cursor-pointer">
                <input
                  type="checkbox"
                  checked={hasReel}
                  onChange={(e) => setHasReel(e.target.checked)}
                  className="rounded accent-wine w-4 h-4"
                />
                <span>Include Reel Slide in Gallery</span>
              </label>
            </div>

            {hasReel && (
              <div className="space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-semibold text-ink mb-1">Instagram Reel URL</label>
                    <input
                      type="url"
                      value={reelUrl}
                      onChange={(e) => setReelUrl(e.target.value)}
                      placeholder="https://www.instagram.com/reel/C8xyz1/"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-blush bg-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[11px] font-semibold text-ink mb-1">Reel Poster Image URL</label>
                    <input
                      type="text"
                      value={reelPosterUrl}
                      onChange={(e) => setReelPosterUrl(e.target.value)}
                      placeholder="/images/reels/poster-C8xyz1.svg"
                      className="w-full px-3.5 py-2 text-xs rounded-xl border border-blush bg-white"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold text-ink mb-1">Reel Caption</label>
                  <input
                    type="text"
                    value={reelCaption}
                    onChange={(e) => setReelCaption(e.target.value)}
                    className="w-full px-3.5 py-2 text-xs rounded-xl border border-blush bg-white"
                  />
                </div>

                <label className="flex items-center gap-2 text-xs font-medium cursor-pointer text-ink">
                  <input
                    type="checkbox"
                    checked={reelShowOnHome}
                    onChange={(e) => setReelShowOnHome(e.target.checked)}
                    className="rounded accent-wine w-4 h-4"
                  />
                  <span>Feature this reel on the Landing Page marquee strip</span>
                </label>
              </div>
            )}
          </div>

          <div className="pt-4 flex justify-end gap-3">
            <Link
              href="/admin/products"
              className="px-6 py-3 rounded-pill border border-blush text-muted text-xs font-bold hover:text-ink"
            >
              Cancel
            </Link>
            <button
              type="submit"
              disabled={loading}
              className="px-8 py-3 rounded-pill bg-wine text-white text-xs font-bold hover:bg-wine-light transition-all flex items-center gap-2 shadow-md disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <Save className="w-4 h-4" />
              <span>Publish Hamper To Store</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
