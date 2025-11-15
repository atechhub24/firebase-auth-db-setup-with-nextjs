import type { MetadataRoute } from "next";
import { marketingSite } from "@/lib/marketing-config";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = marketingSite.url;

  return {
    rules: {
      userAgent: "*",
      allow: "/",
      disallow: [
        "/admin/",
        "/staff/",
        "/api/",
        "/settings/",
        "/dashboard/",
        "/attendance/",
        "/blogs/create/",
        "/blogs/*/update/",
        "/staffs/create/",
        "/staffs/*/update/",
        "/staffs/*/password/",
      ],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
    host: baseUrl,
  };
}
