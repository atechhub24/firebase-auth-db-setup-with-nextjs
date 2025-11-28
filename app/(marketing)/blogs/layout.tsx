import type { Metadata } from "next";
import { marketingSite } from "@/lib/config/marketing";
import {
  firebaseAdminConfig,
  firebaseConfig,
  isFirebaseAdminConfigured,
} from "@/lib/env";
import type { Blog } from "@/lib/types/blog.type";

async function getPublishedBlogs(): Promise<Blog[]> {
  if (!isFirebaseAdminConfigured()) {
    return [];
  }

  try {
    const firebaseAdmin = await import("firebase-admin");

    // Initialize app if needed
    if (firebaseAdmin.apps.length === 0) {
      firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert({
          projectId: firebaseAdminConfig.projectId,
          clientEmail: firebaseAdminConfig.clientEmail,
          privateKey: firebaseAdminConfig.privateKey,
        }),
        projectId: firebaseAdminConfig.projectId,
        databaseURL: firebaseConfig.databaseURL,
      });
    }

    const database = firebaseAdmin.database();
    const blogsRef = database.ref("blogs");
    const snapshot = await blogsRef.once("value");
    const blogsData = snapshot.val();

    if (!blogsData) {
      return [];
    }

    // Convert object to array and filter published blogs
    const blogs: Blog[] = Object.entries(blogsData)
      .map(([id, blogData]) => ({
        ...(blogData as Omit<Blog, "id">),
        id,
      }))
      .filter((blog) => blog.status === "published")
      .sort((a, b) => {
        const aTime =
          a.publishedAt ||
          (typeof a.createdAt === "string"
            ? new Date(a.createdAt).getTime()
            : 0);
        const bTime =
          b.publishedAt ||
          (typeof b.createdAt === "string"
            ? new Date(b.createdAt).getTime()
            : 0);
        return bTime - aTime;
      });

    return blogs;
  } catch (error) {
    console.error("Error fetching blogs for metadata:", error);
    return [];
  }
}

export async function generateMetadata(): Promise<Metadata> {
  const blogs = await getPublishedBlogs();
  const totalBlogs = blogs.length;
  const featuredBlogs = blogs.filter((blog) => blog.featured).length;

  // Get unique categories and tags
  const categories = Array.from(
    new Set(blogs.map((blog) => blog.category))
  ).join(", ");
  const allTags = blogs.flatMap((blog) => blog.tags || []);
  const uniqueTags = Array.from(new Set(allTags)).slice(0, 10).join(", ");

  const description = `Explore ${totalBlogs} published articles${
    featuredBlogs > 0 ? ` including ${featuredBlogs} featured posts` : ""
  }${categories ? ` covering topics like ${categories}` : ""}${
    uniqueTags ? ` tagged with ${uniqueTags}` : ""
  }. ${marketingSite.description}`;

  const ogImageUrl = new URL(
    "/opengraph-image",
    marketingSite.url.endsWith("/")
      ? marketingSite.url
      : `${marketingSite.url}/`
  ).toString();

  return {
    title: "Blog",
    description,
    openGraph: {
      title: "Blog",
      description,
      url: `${marketingSite.url}/blogs`,
      siteName: marketingSite.name,
      images: [
        {
          url: ogImageUrl,
          width: 1200,
          height: 630,
          alt: "Blog - " + marketingSite.name,
        },
      ],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "Blog",
      description,
      images: [ogImageUrl],
    },
    alternates: {
      canonical: `${marketingSite.url}/blogs`,
    },
  };
}

export default function BlogsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
