import type { Metadata } from "next";
import { marketingSite } from "@/lib/config/marketing";
import {
  firebaseAdminConfig,
  firebaseConfig,
  isFirebaseAdminConfigured,
} from "@/lib/env";
import type { Blog } from "@/lib/types/blog.type";

async function getBlogBySlug(slug: string): Promise<Blog | null> {
  if (!isFirebaseAdminConfigured()) {
    return null;
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
      return null;
    }

    // Convert object to array and find blog by slug
    const blogs: Blog[] = Object.entries(blogsData).map(([id, blogData]) => ({
      ...(blogData as Omit<Blog, "id">),
      id,
    }));

    const blog = blogs.find(
      (b) => b.slug === slug && b.status === "published"
    );

    return blog || null;
  } catch (error) {
    console.error("Error fetching blog for metadata:", error);
    return null;
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const blog = await getBlogBySlug(slug);

  if (!blog) {
    return {
      title: "Blog Not Found",
      description: "The blog post you're looking for doesn't exist.",
    };
  }

  const title = blog.title;
  const description = blog.excerpt || blog.title;
  const ogImage = blog.coverImage || `${marketingSite.url}/opengraph-image`;
  const url = `${marketingSite.url}/blogs/${blog.slug}`;
  const publishedTime = blog.publishedAt
    ? new Date(blog.publishedAt).toISOString()
    : blog.createdAt && typeof blog.createdAt === "string"
      ? new Date(blog.createdAt).toISOString()
      : undefined;

  // Build keywords from tags and category
  const keywords = [
    blog.category,
    ...(blog.tags || []),
    blog.author,
  ].filter(Boolean);

  return {
    title,
    description,
    keywords: keywords.length > 0 ? keywords : undefined,
    authors: blog.author ? [{ name: blog.author }] : undefined,
    openGraph: {
      title,
      description,
      url,
      siteName: marketingSite.name,
      images: [
        {
          url: ogImage,
          width: 1200,
          height: 630,
          alt: title,
        },
      ],
      locale: "en_US",
      type: "article",
      publishedTime,
      section: blog.category,
      tags: blog.tags,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    alternates: {
      canonical: url,
    },
  };
}

export default function BlogSlugLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}

