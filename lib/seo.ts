import type { Metadata } from "next";

export const SITE_NAME = "Little Luxe Hamper";
export const SITE_URL =
  process.env.NEXT_PUBLIC_SITE_URL || "https://littleluxehamper.com";
export const DEFAULT_DESCRIPTION =
  "Exquisite hand-packed luxury gift hampers for birthdays, anniversaries, corporate, and festivals across India. Beautiful ribbons, personal notes, nationwide delivery.";

export function constructMetadata({
  title,
  description = DEFAULT_DESCRIPTION,
  image = "/images/og-image.jpg",
  canonicalUrl,
  noIndex = false,
}: {
  title: string;
  description?: string;
  image?: string;
  canonicalUrl?: string;
  noIndex?: boolean;
}): Metadata {
  const fullTitle = title.includes(SITE_NAME) ? title : `${title} | ${SITE_NAME}`;
  const canonical = canonicalUrl ? `${SITE_URL}${canonicalUrl}` : SITE_URL;

  return {
    title: fullTitle.slice(0, 60),
    description: description.slice(0, 155),
    metadataBase: new URL(SITE_URL),
    alternates: {
      canonical,
    },
    robots: noIndex
      ? { index: false, follow: false }
      : { index: true, follow: true },
    openGraph: {
      title: fullTitle.slice(0, 60),
      description: description.slice(0, 155),
      url: canonical,
      siteName: SITE_NAME,
      locale: "en_IN",
      type: "website",
      images: [
        {
          url: image.startsWith("http") ? image : `${SITE_URL}${image}`,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle.slice(0, 60),
      description: description.slice(0, 155),
      images: [image.startsWith("http") ? image : `${SITE_URL}${image}`],
    },
  };
}

export function generateOrganizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_NAME,
    url: SITE_URL,
    logo: `${SITE_URL}/images/logo.png`,
    sameAs: [
      `https://www.instagram.com/${process.env.NEXT_PUBLIC_INSTAGRAM_HANDLE || "little_luxehamper"}`,
    ],
    contactPoint: {
      "@type": "ContactPoint",
      telephone: "+91-9876543210",
      contactType: "customer service",
      areaServed: "IN",
      availableLanguage: ["en", "hi"],
    },
  };
}

export function generateWebSiteJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: SITE_NAME,
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/shop?q={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export function generateProductJsonLd({
  name,
  description,
  sku,
  pricePaise,
  mrpPaise,
  images,
  inStock,
  ratingValue,
  reviewCount,
  url,
}: {
  name: string;
  description: string;
  sku: string;
  pricePaise: number;
  mrpPaise: number;
  images: string[];
  inStock: boolean;
  ratingValue?: number;
  reviewCount?: number;
  url: string;
}) {
  const schema: Record<string, unknown> = {
    "@context": "https://schema.org",
    "@type": "Product",
    name,
    description,
    sku,
    image: images.map((img) => (img.startsWith("http") ? img : `${SITE_URL}${img}`)),
    offers: {
      "@type": "Offer",
      url: `${SITE_URL}${url}`,
      priceCurrency: "INR",
      price: (pricePaise / 100).toFixed(2),
      priceValidUntil: "2027-12-31",
      itemCondition: "https://schema.org/NewCondition",
      availability: inStock
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      seller: {
        "@type": "Organization",
        name: SITE_NAME,
      },
    },
  };

  if (ratingValue && reviewCount && reviewCount > 0) {
    schema.aggregateRating = {
      "@type": "AggregateRating",
      ratingValue: ratingValue.toFixed(1),
      reviewCount,
    };
  }

  return schema;
}

export function generateBreadcrumbJsonLd(
  items: { name: string; item: string }[]
) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.item}`,
    })),
  };
}

export function generateFaqJsonLd(faqs: { question: string; answer: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: faqs.map((f) => ({
      "@type": "Question",
      name: f.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: f.answer,
      },
    })),
  };
}

export function generateVideoObjectJsonLd({
  name,
  description,
  thumbnailUrl,
  contentUrl,
  embedUrl,
  uploadDate,
}: {
  name: string;
  description: string;
  thumbnailUrl: string;
  contentUrl?: string;
  embedUrl?: string;
  uploadDate?: string;
}) {
  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name,
    description,
    thumbnailUrl: thumbnailUrl.startsWith("http") ? thumbnailUrl : `${SITE_URL}${thumbnailUrl}`,
    contentUrl: contentUrl ? (contentUrl.startsWith("http") ? contentUrl : `${SITE_URL}${contentUrl}`) : undefined,
    embedUrl,
    uploadDate: uploadDate || new Date().toISOString(),
  };
}

