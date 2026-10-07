import React from "react";
import Link from "next/link";
import { Sparkles } from "lucide-react";

export function AnnouncementBar() {
  return (
    <aside aria-label="Announcement" className="bg-wine text-cream text-xs sm:text-sm py-2 px-4 transition-colors">
      <div className="max-w-[1240px] mx-auto flex items-center justify-center gap-2 text-center font-medium">
        <Sparkles className="w-3.5 h-3.5 text-gold shrink-0 animate-pulse" />
        <span>
          Diwali & Festive Gifting Open • Free express shipping across India on orders over ₹1,499
        </span>
        <Link
          href="/shop"
          className="underline hover:text-gold transition-colors ml-1 hidden sm:inline"
        >
          Explore Now &rarr;
        </Link>
      </div>
    </aside>
  );
}
