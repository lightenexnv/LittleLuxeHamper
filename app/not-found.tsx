import React from "react";
import Link from "next/link";
import { Sparkles, ArrowRight, Home } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] bg-cream flex items-center justify-center py-20 px-4">
      <div className="max-w-md w-full bg-white rounded-3xl p-8 sm:p-12 border border-blush/80 shadow-luxe text-center space-y-4">
        <span className="text-xs font-bold text-gold uppercase tracking-widest flex items-center justify-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5" />
          <span>404 &bull; Page Not Found</span>
        </span>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold text-wine">
          This Gift Box Has Moved
        </h1>

        <p className="text-xs sm:text-sm text-muted leading-relaxed font-sans">
          The hamper curation or page you are looking for may have been archived or relocated in our atelier.
        </p>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto px-6 py-2.5 rounded-pill border border-wine text-wine hover:bg-blush/30 font-medium text-xs flex items-center justify-center gap-1.5 transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>Return Home</span>
          </Link>

          <Link
            href="/shop"
            className="w-full sm:w-auto px-6 py-2.5 rounded-pill bg-wine text-cream hover:bg-wine-light font-medium text-xs flex items-center justify-center gap-1.5 transition-colors shadow-sm"
          >
            <span>Explore Shop</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
}
