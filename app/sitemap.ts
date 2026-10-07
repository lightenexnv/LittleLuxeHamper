import { MetadataRoute } from "next";
import { db } from "@/lib/db";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://littleluxehamper.com";

  // Static core routes
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}`, lastModified: new Date(), changeFrequency: "daily", priority: 1.0 },
    { url: `${baseUrl}/shop`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${baseUrl}/build-your-hamper`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/corporate-gifting`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/reels`, lastModified: new Date(), changeFrequency: "daily", priority: 0.7 },
    { url: `${baseUrl}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${baseUrl}/faq`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.6 },
    { url: `${baseUrl}/blog`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.7 },
  ];

  // Dynamic products
  const products = await db.product.findMany({
    where: { isActive: true },
    select: { slug: true, updatedAt: true },
  });
  const productRoutes: MetadataRoute.Sitemap = products.map((p) => ({
    url: `${baseUrl}/product/${p.slug}`,
    lastModified: p.updatedAt,
    changeFrequency: "weekly",
    priority: 0.9,
  }));

  // Dynamic collections
  const collections = await db.collection.findMany({ select: { slug: true } });
  const collectionRoutes: MetadataRoute.Sitemap = collections.map((c) => ({
    url: `${baseUrl}/collections/${c.slug}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Occasions
  const occasions = ["diwali", "birthday", "anniversary", "wedding", "corporate"];
  const occasionRoutes: MetadataRoute.Sitemap = occasions.map((occ) => ({
    url: `${baseUrl}/gifts/${occ}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.8,
  }));

  // Budgets
  const budgets = ["999", "1999", "2999"];
  const budgetRoutes: MetadataRoute.Sitemap = budgets.map((b) => ({
    url: `${baseUrl}/gifts/under-${b}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // Cities
  const cities = ["delhi", "mumbai", "bengaluru", "hyderabad", "chennai", "pune", "kolkata", "jaipur", "ahmedabad"];
  const cityRoutes: MetadataRoute.Sitemap = cities.map((city) => ({
    url: `${baseUrl}/send-gifts-to/${city}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  // Policies
  const policies = ["terms", "privacy", "shipping", "refund", "grievance"];
  const policyRoutes: MetadataRoute.Sitemap = policies.map((p) => ({
    url: `${baseUrl}/policies/${p}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.4,
  }));

  // Blog posts
  const blogSlugs = [
    "how-to-choose-the-perfect-diwali-hamper",
    "best-birthday-gifts-for-her-under-2000",
    "corporate-gifting-guide-for-indian-companies",
  ];
  const blogRoutes: MetadataRoute.Sitemap = blogSlugs.map((slug) => ({
    url: `${baseUrl}/blog/${slug}`,
    lastModified: new Date(),
    changeFrequency: "monthly",
    priority: 0.6,
  }));

  return [
    ...staticRoutes,
    ...productRoutes,
    ...collectionRoutes,
    ...occasionRoutes,
    ...budgetRoutes,
    ...cityRoutes,
    ...policyRoutes,
    ...blogRoutes,
  ];
}
