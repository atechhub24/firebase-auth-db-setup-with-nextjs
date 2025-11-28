import type { MetadataRoute } from "next";
import { marketingSite } from "@/lib/config/marketing";
import type { Blog } from "@/lib/types/blog.type";

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

  // Fetch published blogs dynamically from backend API
  let blogPages: MetadataRoute.Sitemap = [];
  try {
    // Use internal API call - in Next.js, we can use relative URLs or call the function directly
    // For build time, we'll use the API route logic directly via firebase-admin
    const { firebaseAdminConfig, isFirebaseAdminConfigured, firebaseConfig } =
      await import("@/lib/env");
    const firebaseAdmin = await import("firebase-admin");

    if (isFirebaseAdminConfigured()) {
      // Initialize app if needed
      let app: ReturnType<typeof firebaseAdmin.app>;
      if (firebaseAdmin.apps.length === 0) {
        app = firebaseAdmin.initializeApp({
          credential: firebaseAdmin.credential.cert({
            projectId: firebaseAdminConfig.projectId,
            clientEmail: firebaseAdminConfig.clientEmail,
            privateKey: firebaseAdminConfig.privateKey,
          }),
          projectId: firebaseAdminConfig.projectId,
          databaseURL: firebaseConfig.databaseURL,
        });
      } else {
        app = firebaseAdmin.app();
      }

      const database = firebaseAdmin.database();
      const blogsRef = database.ref("blogs");
      const snapshot = await blogsRef.once("value");
      const blogsData = snapshot.val();

      if (blogsData) {
        const blogs: Blog[] = Object.entries(blogsData)
          .map(([id, blogData]) => ({
            ...(blogData as Omit<Blog, "id">),
            id,
          }))
          .filter((blog) => blog.status === "published");

        blogPages = blogs.map((blog) => ({
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
      }
    }
  } catch (error) {
    console.error("Error fetching blogs for sitemap:", error);
    // Continue with static pages even if blog fetch fails
  }

  return [...staticPages, ...blogPages];
}
