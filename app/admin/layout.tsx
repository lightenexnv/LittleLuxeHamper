import React from "react";
import Link from "next/link";
import { redirect } from "next/navigation";
import {
  Package,
  Instagram,
  ShoppingBag,
  Tag,
  MessageSquare,
  LayoutDashboard,
  LogOut,
  AlertTriangle,
  FolderTree,
  ExternalLink,
} from "lucide-react";
import { getAdminSession } from "@/lib/auth";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getAdminSession();

  // If not logged in, we let the login page render; otherwise wrap in backoffice frame
  if (!session) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-screen bg-[#F7F5F2] flex flex-col font-sans">
      {/* Prominent Sample Data Indicator Banner */}
      <div className="bg-amber-500 text-ink px-4 py-2 text-xs font-bold flex items-center justify-between">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          <span>
            SAMPLE DATA MODE ACTIVE — The catalogue currently contains sample hampers, posters, and illustrative reviews. Replace them with authentic photography before public ads.
          </span>
        </div>
        <Link
          href="/"
          target="_blank"
          className="underline hover:text-white flex items-center gap-1 shrink-0 ml-4 hidden sm:flex"
        >
          <span>View Live Storefront</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="flex-1 flex flex-col md:flex-row">
        {/* Sidebar */}
        <aside className="w-full md:w-64 bg-ink text-cream p-5 flex flex-col justify-between shrink-0 border-r border-white/10">
          <div className="space-y-6">
            <div className="pb-4 border-b border-white/10">
              <span className="font-serif font-bold text-xl text-cream block">
                Little Luxe Hamper
              </span>
              <span className="text-[10px] uppercase tracking-widest text-gold font-bold">
                Atelier Control Room
              </span>
            </div>

            <nav className="space-y-1 text-xs font-semibold">
              <Link
                href="/admin"
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-cream"
              >
                <LayoutDashboard className="w-4 h-4 text-gold" />
                <span>Dashboard Overview</span>
              </Link>

              <Link
                href="/admin/products"
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-cream"
              >
                <Package className="w-4 h-4 text-gold" />
                <span>Hampers & Products</span>
              </Link>

              <Link
                href="/admin/reels"
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-cream"
              >
                <Instagram className="w-4 h-4 text-gold" />
                <span>Instagram Reels</span>
              </Link>

              <Link
                href="/admin/orders"
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-cream"
              >
                <ShoppingBag className="w-4 h-4 text-gold" />
                <span>Customer Orders</span>
              </Link>

              <Link
                href="/admin/coupons"
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-cream"
              >
                <Tag className="w-4 h-4 text-gold" />
                <span>Discount Coupons</span>
              </Link>

              <Link
                href="/admin/enquiries"
                className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl hover:bg-white/10 transition-colors text-cream"
              >
                <MessageSquare className="w-4 h-4 text-gold" />
                <span>Enquiries (B2B & Concierge)</span>
              </Link>
            </nav>
          </div>

          <div className="pt-6 border-t border-white/10">
            <form action="/api/admin/auth/logout" method="POST">
              <button
                type="submit"
                className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-light hover:text-white hover:bg-white/5 rounded-xl transition-colors font-medium"
              >
                <LogOut className="w-4 h-4" />
                <span>Log Out ({session.email.split("@")[0]})</span>
              </button>
            </form>
          </div>
        </aside>

        {/* Main Content Area */}
        <main className="flex-1 p-6 sm:p-10 max-w-7xl overflow-x-hidden">
          {children}
        </main>
      </div>
    </div>
  );
}
