import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { BookOpen, Calendar, Clock, ArrowRight } from "lucide-react";
import { constructMetadata } from "@/lib/seo";

export const metadata: Metadata = constructMetadata({
  title: "Gifting Guides & Inspiration Blog | Little Luxe Hamper",
  description:
    "Expert gift styling tips, festival unboxing ideas, and curated gift guides for birthdays, Diwali, and corporate gifting across India.",
  canonicalUrl: "/blog",
});

const blogPosts = [
  {
    slug: "how-to-choose-the-perfect-diwali-hamper",
    title: "The Art of Festive Gifting: How to Choose the Perfect Diwali Hamper in India",
    excerpt: "Diwali gifting is an ancient tradition of sharing joy. Discover what elevates a modern hamper: brass diyas, authentic Kashmiri nuts, and satin ribbon packaging.",
    date: "October 10, 2026",
    readTime: "5 min read",
    image: "/images/products/golden-festive-diwali-hamper-1.svg",
    category: "Festive Gifting",
  },
  {
    slug: "best-birthday-gifts-for-her-under-2000",
    title: "Curated Elegance: Best Birthday Gift Hamper Ideas for Her Under ₹2,000",
    excerpt: "Looking for a luxury surprise on a thoughtful budget? Explore our guide to pairing hand-poured soy candles, organic botanicals, and calligraphy wax-sealed notes.",
    date: "October 5, 2026",
    readTime: "4 min read",
    image: "/images/products/blush-elegance-birthday-hamper-1.svg",
    category: "Birthday Guides",
  },
  {
    slug: "corporate-gifting-guide-for-indian-companies",
    title: "The Modern Corporate Gifting Playbook: Why Artisanal Beats Generic Vouchers",
    excerpt: "Generic gift cards get forgotten; tactile artisanal keepsake boxes build enduring brand loyalty. Learn how top companies approach bulk gifting with custom branding.",
    date: "September 28, 2026",
    readTime: "6 min read",
    image: "/images/products/executive-luxe-corporate-hamper-1.svg",
    category: "Corporate Insights",
  },
];

export default function BlogIndexPage() {
  return (
    <div className="bg-cream min-h-screen py-12 sm:py-20">
      <div className="max-w-[1240px] mx-auto px-4 sm:px-6">
        <div className="text-center max-w-xl mx-auto mb-16">
          <span className="text-xs font-bold text-gold uppercase tracking-widest flex items-center justify-center gap-1.5">
            <BookOpen className="w-3.5 h-3.5" />
            <span>The Atelier Journal</span>
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-wine mt-1">
            Gifting Guides & Inspiration
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-2">
            Curated ideas, packaging aesthetics, and seasonal gifting inspiration from our design studio.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {blogPosts.map((post) => (
            <article
              key={post.slug}
              className="bg-white rounded-3xl overflow-hidden border border-blush/80 shadow-sm hover:shadow-luxe transition-all flex flex-col group"
            >
              <Link href={`/blog/${post.slug}`} className="relative aspect-[16/10] overflow-hidden bg-cream block">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <span className="absolute top-3 left-3 bg-wine text-cream text-[10px] font-bold px-2.5 py-1 rounded-full uppercase tracking-wider">
                  {post.category}
                </span>
              </Link>

              <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-3 text-[11px] text-muted mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      <span>{post.date}</span>
                    </span>
                    <span>&bull;</span>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      <span>{post.readTime}</span>
                    </span>
                  </div>

                  <Link href={`/blog/${post.slug}`}>
                    <h2 className="font-serif font-bold text-wine text-xl group-hover:text-gold-dark transition-colors leading-snug">
                      {post.title}
                    </h2>
                  </Link>

                  <p className="text-xs text-ink/80 mt-2 line-clamp-3 leading-relaxed font-sans">
                    {post.excerpt}
                  </p>
                </div>

                <div className="pt-2 border-t border-blush/40">
                  <Link
                    href={`/blog/${post.slug}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-wine group-hover:text-gold-dark"
                  >
                    <span>Read Article</span>
                    <ArrowRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </div>
  );
}
