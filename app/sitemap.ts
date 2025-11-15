import type { MetadataRoute } from "next";
import { marketingSite } from "@/lib/marketing-config";
import { blogService } from "@/lib/services/blog.service";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = marketingSite.url;

  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1.0,
    },
    {
      url: `${baseUrl}/blogs`,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 0.9,
    },
    {
      url: `${baseUrl}/signin`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    {
      url: `${baseUrl}/signup`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
  ];

  // Fetch published blogs dynamically
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    const publishedBlogs = await blogService.getPublished();
    blogPages = publishedBlogs.map((blog) => ({
      url: `${baseUrl}/blogs/${blog.slug}`,
      lastModified:
        blog.updatedAt && typeof blog.updatedAt === "string"
          ? new Date(blog.updatedAt)
          : blog.publishedAt && typeof blog.publishedAt === "number"
            ? new Date(blog.publishedAt)
            : blog.createdAt && typeof blog.createdAt === "string"
              ? new Date(blog.createdAt)
              : new Date(),
      changeFrequency: "weekly" as const,
      priority: blog.featured ? 0.8 : 0.7,
    }));
  } catch (error) {
    console.error("Error fetching blogs for sitemap:", error);
    // Continue with static pages even if blog fetch fails
  }

  return [...staticPages, ...blogPages];
}
