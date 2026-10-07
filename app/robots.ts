import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://littleluxehamper.com";

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: ["/admin/", "/cart", "/checkout", "/api/"],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
