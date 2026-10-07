import React from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import type { Metadata } from "next";
import { ArrowLeft, ShieldCheck } from "lucide-react";
import { constructMetadata } from "@/lib/seo";

interface PolicyPageProps {
  params: {
    slug: string;
  };
}

export const revalidate = 86400; // 24 hours

const policies: Record<
  string,
  { title: string; lastUpdated: string; content: { heading: string; body: string }[] }
> = {
  shipping: {
    title: "Shipping & Delivery Policy",
    lastUpdated: "October 2026",
    content: [
      {
        heading: "1. Pan-India Delivery Network",
        body: "Little Luxe Hamper partners with premier courier networks (including Blue Dart, Delhivery, DTDC, and Shiprocket) to service over 19,000+ pin codes across all Indian states and Union Territories.",
      },
      {
        heading: "2. Estimated Transit Timelines",
        body: "Standard dispatch happens within 24 to 48 hours of order confirmation. Bengaluru local deliveries arrive within 1 business day. Major metro cities (Delhi-NCR, Mumbai, Hyderabad, Chennai, Pune, Kolkata) take 2 to 3 business days. All other serviceable pincodes take 3 to 5 business days.",
      },
      {
        heading: "3. Target Date Scheduling",
        body: "While we cannot legally guarantee the exact courier delivery hour, we schedule carrier handover such that shipments arrive on or shortly prior to your requested delivery date.",
      },
      {
        heading: "4. Shipping Charges & Free Delivery Threshold",
        body: "Orders with a merchandise subtotal of ₹1,499 and above qualify for 100% complimentary express shipping across India. Orders below this threshold incur a flat ₹99 nominal delivery fee.",
      },
      {
        heading: "5. Real-Time Tracking Updates",
        body: "Once your hamper is sealed and dispatched from our atelier, an SMS and email notification with an active tracking link and courier AWB number is generated instantly.",
      },
    ],
  },
  refund: {
    title: "Refund & Cancellation Policy",
    lastUpdated: "October 2026",
    content: [
      {
        heading: "1. Bespoke & Perishable Nature of Hampers",
        body: "Because our gift hampers contain personalized calligraphy note cards, perishable gourmet confectionery, and customized satin ribbon packaging, we do not accept arbitrary returns once an order has been prepared or dispatched.",
      },
      {
        heading: "2. Zero-Breakage Guarantee & Damaged Transit Claims",
        body: "Your satisfaction is paramount. In the rare event that an item arrives damaged or broken during transit, please notify us within 24 hours of delivery with photos of the damaged article via email (concierge@littleluxehamper.com) or WhatsApp (+91-9876543210). We will immediately ship a 100% free replacement or issue a full refund to your original payment method.",
      },
      {
        heading: "3. Order Cancellations Prior to Dispatch",
        body: "You may cancel an order free of charge up to 6 hours after placing it, provided custom calligraphy has not already been completed. Once dispatched to the courier, cancellations cannot be processed.",
      },
      {
        heading: "4. Refund Processing Window",
        body: "Approved refunds are credited back to the original UPI, Card, or Bank account within 5 to 7 business days per banking and RBI standard turnaround times.",
      },
    ],
  },
  terms: {
    title: "Terms of Service",
    lastUpdated: "October 2026",
    content: [
      {
        heading: "1. Acceptance of Terms",
        body: "By visiting or purchasing from Little Luxe Hamper (www.littleluxehamper.com), you agree to be bound by these Terms of Service in compliance with the Information Technology Act, 2000 and the Consumer Protection (E-Commerce) Rules, 2020.",
      },
      {
        heading: "2. Product Accuracy & Pricing",
        body: "All prices on our storefront are quoted in Indian Rupees (INR) and are inclusive of Goods and Services Tax (GST). We reserve the right to modify prices or substitute out-of-stock gourmet flavors with items of equal or superior quality upon notifying the buyer.",
      },
      {
        heading: "3. Gift Message Etiquette",
        body: "Customers agree not to submit offensive, defamatory, or unlawful content in complimentary gift messages. Little Luxe Hamper reserves the right to decline printing inappropriate notes.",
      },
      {
        heading: "4. Governing Law & Jurisdiction",
        body: "These terms and conditions are governed by the laws of India. Any legal dispute or claim arising shall be subject to the exclusive jurisdiction of the competent courts in Bengaluru, Karnataka.",
      },
    ],
  },
  privacy: {
    title: "Privacy Policy",
    lastUpdated: "October 2026",
    content: [
      {
        heading: "1. Data Protection & DPDP Act 2023 Compliance",
        body: "Little Luxe Hamper values the confidentiality of your personal information. We handle all customer data in accordance with India's Digital Personal Data Protection Act (DPDP Act 2023).",
      },
      {
        heading: "2. Information We Collect",
        body: "We collect only the essential details needed to fulfill orders: your name, billing and shipping address, email address, recipient contact numbers, and optional gift message notes. We never store credit card numbers, CVVs, or UPI PINs on our servers.",
      },
      {
        heading: "3. Secure Payment Gateway Integration",
        body: "All online transactions are processed through PCI-DSS Level 1 compliant payment gateways (Razorpay / dummy simulation during testing) using 256-bit bank-grade encryption.",
      },
      {
        heading: "4. Third-Party Disclosures",
        body: "We share delivery details strictly with authorized courier logistics providers (e.g., Shiprocket, Delhivery, Blue Dart) solely to facilitate physical package delivery and tracking SMS dispatch.",
      },
    ],
  },
  grievance: {
    title: "Grievance Redressal Officer",
    lastUpdated: "October 2026",
    content: [
      {
        heading: "1. Consumer Protection Disclosures",
        body: "In accordance with the Consumer Protection Act, 2019 and the Consumer Protection (E-Commerce) Rules, 2020, the designated Grievance Redressal Officer for Little Luxe Hamper is detailed below:",
      },
      {
        heading: "2. Officer Contact Information",
        body: "Name: Ms. Radhika Sen\nDesignation: Head of Customer Experience & Grievances\nEmail: grievance@littleluxehamper.com\nTelephone: +91 98765 43210\nAtelier Address: Little Luxe Hamper, 12th Main Road, Indiranagar, Bengaluru, Karnataka - 560038, India.",
      },
      {
        heading: "3. Grievance Response Timelines",
        body: "Any formal complaint received will be acknowledged within 48 hours of receipt. The grievance officer will investigate and seek complete resolution within 30 business days.",
      },
    ],
  },
};

export async function generateStaticParams() {
  return Object.keys(policies).map((slug) => ({ slug }));
}

export async function generateMetadata({ params }: PolicyPageProps): Promise<Metadata> {
  const policy = policies[params.slug];
  if (!policy) return {};

  return constructMetadata({
    title: `${policy.title} | Little Luxe Hamper`,
    description: `Official ${policy.title} for Little Luxe Hamper e-commerce platform in India.`,
    canonicalUrl: `/policies/${params.slug}`,
  });
}

export default async function PolicyDetailPage({ params }: PolicyPageProps) {
  const policy = policies[params.slug];
  if (!policy) notFound();

  return (
    <div className="bg-cream min-h-screen py-12 sm:py-20">
      <div className="max-w-[800px] mx-auto px-4 sm:px-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-bold text-wine hover:text-gold-dark mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Home</span>
        </Link>

        <div className="bg-white rounded-3xl p-6 sm:p-12 border border-blush/80 shadow-luxe space-y-8">
          <div className="border-b border-blush/60 pb-6">
            <span className="text-xs font-bold text-gold uppercase tracking-widest flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>Official Policy & Compliance</span>
            </span>
            <h1 className="font-serif text-3xl sm:text-4xl font-bold text-wine mt-1">
              {policy.title}
            </h1>
            <p className="text-xs text-muted mt-2">
              Effective Date: {policy.lastUpdated} &bull; Applicable across India
            </p>
          </div>

          <div className="space-y-6 text-xs sm:text-sm text-ink/85 leading-relaxed font-sans">
            {policy.content.map((sec, idx) => (
              <div key={idx} className="space-y-2">
                <h3 className="font-serif font-bold text-wine text-base sm:text-lg">
                  {sec.heading}
                </h3>
                <p className="whitespace-pre-line text-muted">{sec.body}</p>
              </div>
            ))}
          </div>

          <div className="pt-6 border-t border-blush/60 text-xs text-muted flex items-center justify-between">
            <span>Little Luxe Hamper Atelier, Bengaluru</span>
            <Link href="/contact" className="text-wine font-semibold hover:underline">
              Contact Support
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
