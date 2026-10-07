import React from "react";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import { Truck, Sparkles, MapPin, ShieldCheck } from "lucide-react";
import { db } from "@/lib/db";
import { ProductCard } from "@/components/ui/ProductCard";
import { PincodeChecker } from "@/components/product/PincodeChecker";
import { FaqAccordion } from "@/components/home/FaqAccordion";
import { constructMetadata, generateBreadcrumbJsonLd } from "@/lib/seo";

interface CityPageProps {
  params: {
    city: string;
  };
}

export const revalidate = 300;

const cityData: Record<
  string,
  { name: string; state: string; eta: string; desc: string; samplePin: string }
> = {
  delhi: {
    name: "Delhi-NCR",
    state: "Delhi / Haryana / UP",
    eta: "1 to 2 business days",
    desc: "Send exquisite luxury gift hampers to New Delhi, Gurugram, and Noida. Handpacked with wax seals, satin ribbons, and fast tracked courier delivery.",
    samplePin: "110001",
  },
  mumbai: {
    name: "Mumbai",
    state: "Maharashtra",
    eta: "1 to 2 business days",
    desc: "Order curated boutique gift boxes delivered across South Mumbai, Bandra, Andheri, Powai, and Thane. Perfect for birthdays, Diwali, and romance.",
    samplePin: "400001",
  },
  bengaluru: {
    name: "Bengaluru",
    state: "Karnataka",
    eta: "Same-day / Next-day dispatch (Atelier Origin)",
    desc: "Direct from our flagship Bangalore atelier! Fastest priority delivery across Koramangala, Indiranagar, Whitefield, and Electronic City.",
    samplePin: "560001",
  },
  hyderabad: {
    name: "Hyderabad",
    state: "Telangana",
    eta: "1 to 2 business days",
    desc: "Send bespoke gift hampers to Jubilee Hills, Banjara Hills, Gachibowli, and Hitec City. Handcrafted dry fruit, brass diya, and pamper sets.",
    samplePin: "500001",
  },
  chennai: {
    name: "Chennai",
    state: "Tamil Nadu",
    eta: "2 business days",
    desc: "Express gift hamper delivery across Chennai, including Alwarpet, Besant Nagar, and Anna Nagar. Sealed in our signature rigid keepsake boxes.",
    samplePin: "600001",
  },
  pune: {
    name: "Pune",
    state: "Maharashtra",
    eta: "2 business days",
    desc: "Thoughtful artisanal gift curations delivered to Koregaon Park, Kothrud, Kalyani Nagar, and Baner with personalized calligraphy notes.",
    samplePin: "411001",
  },
  kolkata: {
    name: "Kolkata",
    state: "West Bengal",
    eta: "2 to 3 business days",
    desc: "Send heartwarming luxury hampers to Salt Lake, Ballygunge, Park Street, and New Town. Fully insulated packaging for gourmet chocolates.",
    samplePin: "700001",
  },
  jaipur: {
    name: "Jaipur",
    state: "Rajasthan",
    eta: "2 to 3 business days",
    desc: "Royal handcrafted gift boxes delivered across Jaipur. Brass diyas, artisan coffees, and keepsake trousseau trunks.",
    samplePin: "302001",
  },
  ahmedabad: {
    name: "Ahmedabad",
    state: "Gujarat",
    eta: "2 to 3 business days",
    desc: "Bespoke vegetarian gourmet hampers, roasted dry fruit crates, and celebratory Diwali boxes delivered across Ahmedabad and Gandhinagar.",
    samplePin: "380001",
  },
};

export async function generateStaticParams() {
  return Object.keys(cityData).map((city) => ({ city }));
}

export async function generateMetadata({ params }: CityPageProps): Promise<Metadata> {
  const city = cityData[params.city.toLowerCase()];
  if (!city) return {};

  return constructMetadata({
    title: `Send Gift Hampers to ${city.name} | Express Delivery | Little Luxe`,
    description: city.desc.slice(0, 155),
    canonicalUrl: `/send-gifts-to/${params.city}`,
  });
}

export default async function SendGiftsToCityPage({ params }: CityPageProps) {
  const city = cityData[params.city.toLowerCase()];
  if (!city) notFound();

  const products = await db.product.findMany({
    where: { isActive: true },
    include: { images: { orderBy: { sort: "asc" } } },
    take: 8,
    orderBy: { createdAt: "desc" },
  });

  const breadcrumbs = generateBreadcrumbJsonLd([
    { name: "Home", item: "/" },
    { name: "Send Gifts To", item: "/shop" },
    { name: city.name, item: `/send-gifts-to/${params.city}` },
  ]);

  return (
    <div className="bg-cream min-h-screen">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbs) }}
      />

      <div className="bg-white border-b border-blush/60 py-12 text-center">
        <div className="max-w-[1240px] mx-auto px-4">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blush text-wine text-xs font-bold uppercase tracking-wider mb-2">
            <MapPin className="w-3.5 h-3.5" />
            <span>Delivering to {city.name}, {city.state}</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold text-wine">
            Send Gift Hampers to {city.name}
          </h1>
          <p className="text-xs sm:text-sm text-muted mt-3 max-w-xl mx-auto leading-relaxed">
            {city.desc}
          </p>
          <div className="mt-4 flex items-center justify-center gap-2 text-xs font-semibold text-success">
            <Truck className="w-4 h-4" />
            <span>Standard Courier ETA: {city.eta}</span>
          </div>
        </div>
      </div>

      <div className="max-w-[1240px] mx-auto px-4 sm:px-6 py-12">
        {/* Local Pincode Checker Card */}
        <div className="max-w-md mx-auto mb-12">
          <PincodeChecker />
        </div>

        <div className="mb-6 flex items-center justify-between">
          <h2 className="font-serif text-2xl font-bold text-wine">
            Top Hampers Dispatched to {city.name}
          </h2>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
          {products.map((p) => (
            <ProductCard
              key={p.id}
              id={p.id}
              slug={p.slug}
              name={p.name}
              pricePaise={p.pricePaise}
              mrpPaise={p.mrpPaise}
              isSample={p.isSample}
              images={p.images}
            />
          ))}
        </div>
      </div>

      <FaqAccordion />
    </div>
  );
}
