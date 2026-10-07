import React from "react";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { Calendar, Clock, ArrowLeft, ArrowRight, Sparkles, Gift } from "lucide-react";
import { constructMetadata, generateBreadcrumbJsonLd } from "@/lib/seo";

interface BlogPostPageProps {
  params: {
    slug: string;
  };
}

export const revalidate = 300;

const fullPosts: Record<
  string,
  {
    title: string;
    date: string;
    readTime: string;
    image: string;
    category: string;
    content: string[];
    recommendedProductSlug: string;
    recommendedProductName: string;
  }
> = {
  "how-to-choose-the-perfect-diwali-hamper": {
    title: "The Art of Festive Gifting: How to Choose the Perfect Diwali Hamper in India",
    date: "October 10, 2026",
    readTime: "5 min read",
    image: "/images/products/golden-festive-diwali-hamper-1.svg",
    category: "Festive Gifting",
    content: [
      "Diwali is when India opens its heart and home to celebrate prosperity, gratitude, and togetherness. Yet, generic plastic-wrapped sweet boxes purchased off grocery store shelves rarely convey the depth of personal affection.",
      "When selecting a festive gift hamper that stands apart, look for three essential signatures of authenticity: tactile craftsmanship, artisanal confectionery, and keepsake longevity.",
      "First, prioritize keepsake elements. A hand-cast pure brass lotus diya or a handcrafted temple bell outlasts the celebration, becoming a permanent part of your recipient's pooja altar for decades.",
      "Second, choose gourmet roasted treats over mass-produced fried snacks. Kashmiri mamra almonds, whole cashews, and saffron-infused brittle satisfy festive sweet cravings while respecting healthy mindful choices.",
      "Finally, presentation creates the emotional peak. A double-faced silk satin ribbon tied in a double bow, accompanied by a personalized note sealed with real sealing wax, transforms an ordinary delivery into a memorable milestone.",
    ],
    recommendedProductSlug: "golden-festive-diwali-hamper",
    recommendedProductName: "Golden Radiance Festive Hamper",
  },
  "best-birthday-gifts-for-her-under-2000": {
    title: "Curated Elegance: Best Birthday Gift Hamper Ideas for Her Under ₹2,000",
    date: "October 5, 2026",
    readTime: "4 min read",
    image: "/images/products/blush-elegance-birthday-hamper-1.svg",
    category: "Birthday Guides",
    content: [
      "Great gifting is never about how much you spend; it is about how deeply the recipient feels seen, celebrated, and cherished.",
      "For birthdays under ₹2,000, curating multi-sensory delights creates unmatched perceived value. Pair an aromatic hand-poured soy candle with calming French lavender, a pure rose quartz facial roller, and sweet almond brittle.",
      "The secret lies in cohesive visual aesthetics: blush pink and champagne gold tones immediately evoke feelings of a Parisian spa getaway.",
      "Complete the curation with an authentic handwritten message. At Little Luxe Hamper, our calligraphers transcribe your message word-for-word onto luxury parchment paper.",
    ],
    recommendedProductSlug: "blush-elegance-birthday-hamper",
    recommendedProductName: "Blush Elegance Birthday Hamper",
  },
  "corporate-gifting-guide-for-indian-companies": {
    title: "The Modern Corporate Gifting Playbook: Why Artisanal Beats Generic Vouchers",
    date: "September 28, 2026",
    readTime: "6 min read",
    image: "/images/products/executive-luxe-corporate-hamper-1.svg",
    category: "Corporate Insights",
    content: [
      "For years, corporate gifting in India followed a predictable script: plastic-wrapped dry fruits, branded USB drives, or email shopping vouchers that ended up ignored or forgotten.",
      "Modern leadership, HR heads, and brand directors recognize that gifts are high-stakes brand touchpoints. A thoughtfully styled physical gift on an executive's desk communicates taste, intentionality, and high regard.",
      "When designing corporate gift programs, leading Indian enterprises now insist on subtle, elegant branding: an embossed monochrome logo on the box lid rather than loud screen-printed merchandise.",
      "Include elevated daily utility: single-origin Arabica pour-over coffee, double-walled matte black drinkware, and hardbound vegan leather journals with precision pens.",
    ],
    recommendedProductSlug: "executive-luxe-corporate-hamper",
    recommendedProductName: "Executive Luxe Corporate Gift Set",
  },
};

export async function generateStaticParams() {
  return Object.keys(fullPosts).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: BlogPostPageProps): Promise<Metadata> {
  const post = fullPosts[params.slug];
  if (!post) return {};

  return constructMetadata({
    title: `${post.title.slice(0, 50)} | Little Luxe Hamper`,
    description: post.content[0].slice(0, 155),
    image: post.image,
    canonicalUrl: `/blog/${params.slug}`,
  });
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const post = fullPosts[params.slug];
  if (!post) notFound();

  const breadcrumbs = generateBreadcrumbJsonLd([
    { name: "Home", item: "/" },
    { name: "Blog", item: "/blog" },
    { name: post.title, item: `/blog/${params.slug}` },
  ]);

  return (
    <div className="bg-cream min-h-screen py-10 sm:py-16">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <article className="max-w-[800px] mx-auto px-4 sm:px-6">
        <Link
          href="/blog"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-wine hover:text-gold-dark mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to All Articles</span>
        </Link>

        {/* Header */}
        <div className="space-y-4 mb-8">
          <span className="bg-blush text-wine text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider">
            {post.category}
          </span>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-wine leading-tight">
            {post.title}
          </h1>
          <div className="flex items-center gap-4 text-xs text-muted">
            <span className="flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" />
              <span>{post.date}</span>
            </span>
            <span>&bull;</span>
            <span className="flex items-center gap-1">
              <Clock className="w-3.5 h-3.5" />
              <span>{post.readTime}</span>
            </span>
          </div>
        </div>

        {/* Featured Image */}
        <div className="relative aspect-[16/10] rounded-3xl overflow-hidden border border-blush/80 shadow-md mb-10 bg-white">
          <Image
            src={post.image}
            alt={post.title}
            fill
            priority
            sizes="(max-width: 800px) 100vw, 800px"
            className="object-cover"
          />
        </div>

        {/* Content Paragraphs */}
        <div className="prose prose-stone max-w-none space-y-6 text-sm sm:text-base leading-relaxed text-ink/90 font-sans">
          {post.content.map((p, idx) => (
            <p key={idx}>{p}</p>
          ))}
        </div>

        {/* Inline Upsell Box */}
        <div className="mt-12 p-6 sm:p-8 rounded-3xl bg-white border border-blush/80 shadow-luxe flex flex-col sm:flex-row items-center justify-between gap-6">
          <div className="space-y-1 text-center sm:text-left">
            <span className="text-xs font-bold text-gold uppercase tracking-widest flex items-center justify-center sm:justify-start gap-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Featured Curation</span>
            </span>
            <h3 className="font-serif font-bold text-wine text-xl">
              {post.recommendedProductName}
            </h3>
            <p className="text-xs text-muted">
              Handpacked with silk satin ribbons and wax-sealed notes. Express pan-India delivery.
            </p>
          </div>

          <Link
            href={`/product/${post.recommendedProductSlug}`}
            className="px-6 py-3 rounded-pill bg-wine text-white text-xs font-bold hover:bg-wine-light transition-all shrink-0 flex items-center gap-1.5 shadow-sm"
          >
            <span>View Hamper</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </article>
    </div>
  );
}
