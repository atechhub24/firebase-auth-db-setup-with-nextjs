import { NextResponse } from "next/server";
import {
  firebaseAdminConfig,
  firebaseConfig,
  isFirebaseAdminConfigured,
} from "@/lib/env";
import type { Blog } from "@/lib/types/blog.type";

// Lazy import firebase-admin to avoid bundling issues
let admin: typeof import("firebase-admin") | null = null;

async function getAdmin() {
  if (!admin) {
    admin = await import("firebase-admin");
  }
  return admin;
}

export async function GET() {
  try {
    if (!isFirebaseAdminConfigured()) {
      return NextResponse.json(
        { error: "Firebase Admin SDK is not configured", blogs: [] },
        { status: 500 }
      );
    }

    const firebaseAdmin = await getAdmin();

    // Check if app is already initialized and initialize if needed
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

    // Fetch all blogs from Firebase Realtime Database
    const blogsRef = database.ref("blogs");
    const snapshot = await blogsRef.once("value");
    const blogsData = snapshot.val();

    if (!blogsData) {
      return NextResponse.json({ blogs: [] }, { status: 200 });
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

    return NextResponse.json({ blogs }, { status: 200 });
  } catch (error) {
    console.error("Error fetching blogs:", error);
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Unknown error",
        blogs: [],
      },
      { status: 500 }
    );
  }
}
