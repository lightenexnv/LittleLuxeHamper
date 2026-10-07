"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShoppingBag, Search, Menu, X, Instagram, Gift } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";

export function Header() {
  const router = useRouter();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const { getItemCount, setMiniCartOpen } = useCartStore();

  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    setMounted(true);
  }, []);

  const itemCount = mounted ? getItemCount() : 0;

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/shop?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-blush/60 shadow-sm transition-all">
        <div className="max-w-[1240px] mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between gap-4">
          {/* Mobile Hamburger */}
          <div className="flex items-center gap-2 lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(true)}
              className="p-2 text-ink hover:text-wine rounded-full hover:bg-blush/30 transition-colors"
              aria-label="Open menu"
            >
              <Menu className="w-6 h-6" />
            </button>
            <button
              onClick={() => setSearchOpen(!searchOpen)}
              className="p-2 text-ink hover:text-wine rounded-full hover:bg-blush/30 transition-colors"
              aria-label="Search"
            >
              <Search className="w-5 h-5" />
            </button>
          </div>

          {/* Brand Logo */}
          <Link href="/" className="flex flex-col items-center text-center group py-1">
            <span className="font-serif text-2xl sm:text-3xl font-bold tracking-tight text-wine group-hover:text-wine-light transition-colors">
              Little Luxe Hamper
            </span>
            <span className="text-[10px] tracking-[0.25em] uppercase text-gold font-medium -mt-1 hidden sm:inline">
              Atelier &bull; India
            </span>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-7 text-sm font-medium text-ink">
            <Link
              href="/shop"
              className="hover:text-wine transition-colors py-1 hover:border-b-2 hover:border-wine"
            >
              Shop All
            </Link>
            <Link
              href="/collections/festive-gifting"
              className="hover:text-wine transition-colors py-1 hover:border-b-2 hover:border-wine"
            >
              Festive
            </Link>
            <Link
              href="/collections/birthday-hampers"
              className="hover:text-wine transition-colors py-1 hover:border-b-2 hover:border-wine"
            >
              Birthdays
            </Link>
            <Link
              href="/collections/anniversary-celebration"
              className="hover:text-wine transition-colors py-1 hover:border-b-2 hover:border-wine"
            >
              Anniversary
            </Link>
            <Link
              href="/build-your-hamper"
              className="flex items-center gap-1 text-gold hover:text-gold-dark transition-colors py-1"
            >
              <Gift className="w-3.5 h-3.5" />
              <span>Custom Box</span>
            </Link>
            <Link
              href="/reels"
              className="flex items-center gap-1 text-rose-dark hover:text-wine transition-colors py-1"
            >
              <Instagram className="w-3.5 h-3.5" />
              <span>Reels</span>
            </Link>
            <Link
              href="/corporate-gifting"
              className="hover:text-wine transition-colors py-1 text-xs uppercase tracking-wider text-muted hover:text-wine font-semibold"
            >
              Corporate
            </Link>
          </nav>

          {/* Actions: Search & Cart */}
          <div className="flex items-center gap-3">
            {/* Desktop Search Toggle */}
            <div className="hidden sm:block relative">
              {searchOpen ? (
                <form onSubmit={handleSearchSubmit} className="relative flex items-center">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search hampers, candles, tea..."
                    className="w-56 pl-3 pr-8 py-1.5 text-xs rounded-full border border-blush bg-cream focus:outline-none focus:ring-1 focus:ring-wine"
                    autoFocus
                  />
                  <button
                    type="button"
                    onClick={() => setSearchOpen(false)}
                    className="absolute right-2 text-muted hover:text-ink"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </form>
              ) : (
                <button
                  onClick={() => setSearchOpen(true)}
                  className="p-2 text-ink hover:text-wine rounded-full hover:bg-blush/30 transition-colors"
                  aria-label="Search site"
                >
                  <Search className="w-5 h-5" />
                </button>
              )}
            </div>

            {/* Cart Trigger */}
            <button
              onClick={() => setMiniCartOpen(true)}
              className="relative p-2.5 bg-cream hover:bg-blush/40 text-wine rounded-full transition-all flex items-center justify-center border border-blush/80"
              aria-label={`Open gift basket with ${itemCount} items`}
            >
              <ShoppingBag className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-wine text-white text-[11px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-sm">
                  {itemCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Search Bar Expansion */}
        {searchOpen && (
          <div className="sm:hidden px-4 py-2 bg-cream border-t border-blush">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search hampers, candles, chocolates..."
                className="w-full pl-4 pr-10 py-2 text-sm rounded-full border border-blush bg-white focus:outline-none focus:ring-1 focus:ring-wine"
                autoFocus
              />
              <button
                type="submit"
                className="absolute right-3 text-wine"
                aria-label="Submit search"
              >
                <Search className="w-4 h-4" />
              </button>
            </form>
          </div>
        )}
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div
            className="fixed inset-0 bg-ink/60 backdrop-blur-sm"
            onClick={() => setMobileMenuOpen(false)}
          />
          <div className="fixed inset-y-0 left-0 w-4/5 max-w-sm bg-cream p-6 shadow-2xl flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-6 border-b border-blush">
                <div>
                  <span className="font-serif text-xl font-bold text-wine">Little Luxe Hamper</span>
                  <p className="text-[10px] tracking-wider text-gold uppercase font-medium">Boutique Gifting</p>
                </div>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-1.5 text-muted hover:text-ink rounded-full"
                  aria-label="Close menu"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <nav className="mt-6 space-y-4 text-base font-medium text-ink">
                <Link
                  href="/shop"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block hover:text-wine py-1"
                >
                  Shop All Hampers
                </Link>
                <Link
                  href="/collections/festive-gifting"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block hover:text-wine py-1"
                >
                  Festive & Diwali
                </Link>
                <Link
                  href="/collections/birthday-hampers"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block hover:text-wine py-1"
                >
                  Birthdays
                </Link>
                <Link
                  href="/collections/anniversary-celebration"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block hover:text-wine py-1"
                >
                  Anniversary
                </Link>
                <Link
                  href="/collections/under-1999"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block hover:text-wine py-1"
                >
                  Hampers Under ₹1,999
                </Link>
                <Link
                  href="/build-your-hamper"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-gold hover:text-gold-dark font-semibold py-1 flex items-center gap-2"
                >
                  <Gift className="w-4 h-4" />
                  <span>Build Your Own Hamper</span>
                </Link>
                <Link
                  href="/reels"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-rose-dark hover:text-wine font-medium py-1 flex items-center gap-2"
                >
                  <Instagram className="w-4 h-4" />
                  <span>Instagram Reels Gallery</span>
                </Link>
                <Link
                  href="/corporate-gifting"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block hover:text-wine py-1"
                >
                  Corporate & Bulk Gifting
                </Link>
                <Link
                  href="/track-order"
                  onClick={() => setMobileMenuOpen(false)}
                  className="block text-muted hover:text-wine py-1 text-sm"
                >
                  Track Order
                </Link>
              </nav>
            </div>

            <div className="pt-6 border-t border-blush text-xs text-muted space-y-2">
              <p>Handpacked with love in India.</p>
              <div className="flex gap-4">
                <a
                  href={`https://instagram.com/${process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || "little_luxehamper"}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-wine hover:underline"
                >
                  Instagram @little_luxehamper
                </a>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
