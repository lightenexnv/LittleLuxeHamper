import React from "react";
import Link from "next/link";
import { Instagram, Mail, Phone, ShieldCheck, Truck, Sparkles, HeartHandshake } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-ink text-cream pt-16 pb-12 border-t border-wine-dark mt-20">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        {/* Trust Badges Bar */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 pb-14 border-b border-white/10 text-center">
          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-wine-light/30 flex items-center justify-center text-gold mb-3">
              <Truck className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-lg font-bold">Pan-India Delivery</h4>
            <p className="text-xs text-muted mt-1">Reliable express courier to 19,000+ pincodes</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-wine-light/30 flex items-center justify-center text-gold mb-3">
              <Sparkles className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-lg font-bold">Handcrafted Satin Ribbon</h4>
            <p className="text-xs text-muted mt-1">Tied individually by master gift stylists</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-wine-light/30 flex items-center justify-center text-gold mb-3">
              <HeartHandshake className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-lg font-bold">Personal Handwritten Card</h4>
            <p className="text-xs text-muted mt-1">Complimentary gold wax seal calligraphy note</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="w-12 h-12 rounded-full bg-wine-light/30 flex items-center justify-center text-gold mb-3">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h4 className="font-serif text-lg font-bold">100% Safe & Secure</h4>
            <p className="text-xs text-muted mt-1">Encrypted checkout with UPI, Cards & COD</p>
          </div>
        </div>

        {/* Main Links */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-10 py-12 border-b border-white/10">
          {/* Brand Info */}
          <div className="md:col-span-2 space-y-4">
            <h3 className="font-serif text-2xl font-bold tracking-tight text-cream">
              Little Luxe Hamper
            </h3>
            <p className="text-xs leading-relaxed text-muted max-w-sm">
              An artisanal gifting boutique serving all of India. We transform heartfelt emotions
              into memorable unboxing experiences with luxurious packaging, curated treats, and
              uncompromising aesthetic excellence.
            </p>
            <div className="pt-2 flex items-center gap-3">
              <a
                href={`https://instagram.com/${process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || "little_luxehamper"}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-wine flex items-center justify-center transition-colors text-cream"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href={`https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER || "919876543210"}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-success flex items-center justify-center transition-colors text-cream"
                aria-label="WhatsApp"
              >
                <Phone className="w-4 h-4" />
              </a>
              <a
                href="mailto:concierge@littleluxehamper.com"
                className="w-9 h-9 rounded-full bg-white/10 hover:bg-wine flex items-center justify-center transition-colors text-cream"
                aria-label="Email"
              >
                <Mail className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Occasions */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-bold text-gold tracking-wide uppercase text-xs">
              Occasions
            </h4>
            <ul className="space-y-2 text-xs text-cream/80">
              <li>
                <Link href="/collections/festive-gifting" className="hover:text-gold transition-colors">
                  Festive & Diwali
                </Link>
              </li>
              <li>
                <Link href="/collections/birthday-hampers" className="hover:text-gold transition-colors">
                  Birthday Hampers
                </Link>
              </li>
              <li>
                <Link href="/collections/anniversary-celebration" className="hover:text-gold transition-colors">
                  Anniversary Hampers
                </Link>
              </li>
              <li>
                <Link href="/collections/wedding-hampers" className="hover:text-gold transition-colors">
                  Wedding Trousseau
                </Link>
              </li>
              <li>
                <Link href="/collections/baby-shower-newborn" className="hover:text-gold transition-colors">
                  Baby Shower & Newborn
                </Link>
              </li>
              <li>
                <Link href="/corporate-gifting" className="hover:text-gold transition-colors">
                  Corporate Bulk Orders
                </Link>
              </li>
            </ul>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-bold text-gold tracking-wide uppercase text-xs">
              Discover
            </h4>
            <ul className="space-y-2 text-xs text-cream/80">
              <li>
                <Link href="/shop" className="hover:text-gold transition-colors">
                  All Collections
                </Link>
              </li>
              <li>
                <Link href="/build-your-hamper" className="hover:text-gold transition-colors">
                  Build Your Own Hamper
                </Link>
              </li>
              <li>
                <Link href="/reels" className="hover:text-gold transition-colors">
                  Instagram Reels Gallery
                </Link>
              </li>
              <li>
                <Link href="/about" className="hover:text-gold transition-colors">
                  Our Story & Atelier
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-gold transition-colors">
                  Gifting Guides & Blog
                </Link>
              </li>
              <li>
                <Link href="/track-order" className="hover:text-gold transition-colors">
                  Track Your Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Policies & Compliance */}
          <div className="space-y-3">
            <h4 className="font-serif text-base font-bold text-gold tracking-wide uppercase text-xs">
              Customer Care & Legal
            </h4>
            <ul className="space-y-2 text-xs text-cream/80">
              <li>
                <Link href="/contact" className="hover:text-gold transition-colors">
                  Contact Concierge
                </Link>
              </li>
              <li>
                <Link href="/faq" className="hover:text-gold transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/policies/shipping" className="hover:text-gold transition-colors">
                  Shipping & Delivery Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/refund" className="hover:text-gold transition-colors">
                  Refund & Cancellation Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/terms" className="hover:text-gold transition-colors">
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link href="/policies/privacy" className="hover:text-gold transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/policies/grievance" className="hover:text-gold transition-colors">
                  Grievance Officer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Disclosures */}
        <div className="pt-8 flex flex-col md:flex-row items-center justify-between text-[11px] text-muted gap-4">
          <p>
            &copy; {new Date().getFullYear()} Little Luxe Hamper. All rights reserved. Handcrafted in India.
          </p>
          <div className="flex items-center gap-4 text-[10px]">
            <span>GSTIN: 29AAAAA0000A1Z5 (Registered)</span>
            <span>&bull;</span>
            <span>FSSAI Lic: 21223000000000</span>
            <span>&bull;</span>
            <Link href="/admin/login" className="hover:underline text-cream/50">
              Admin Login
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
