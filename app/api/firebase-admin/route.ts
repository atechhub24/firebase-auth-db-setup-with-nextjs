import { NextResponse } from "next/server";
import { firebaseAdminConfig, isFirebaseAdminConfigured } from "@/lib/env";

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
    // Check if Firebase Admin is configured
    if (!isFirebaseAdminConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error: "Firebase Admin SDK is not configured",
          message:
            "Please ensure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY are set in your environment variables",
          configured: false,
        },
        { status: 400 }
      );
    }

    // Dynamically import firebase-admin
    const firebaseAdmin = await getAdmin();

    // Check if app is already initialized
    let app: ReturnType<typeof firebaseAdmin.app>;
    if (firebaseAdmin.apps.length === 0) {
      // Initialize Firebase Admin with credentials from env
      app = firebaseAdmin.initializeApp({
        credential: firebaseAdmin.credential.cert({
          projectId: firebaseAdminConfig.projectId,
          clientEmail: firebaseAdminConfig.clientEmail,
          privateKey: firebaseAdminConfig.privateKey,
        }),
        projectId: firebaseAdminConfig.projectId,
      });
    } else {
      app = firebaseAdmin.app();
    }

    // Get project information to verify connection
    const projectId = app.options.projectId;
    const auth = firebaseAdmin.auth(app);

    // Try to list users (first 1) to verify admin access
    // This is a lightweight operation that confirms Admin SDK is working
    const listUsersResult = await auth.listUsers(1);

    return NextResponse.json(
      {
        success: true,
        message: "Firebase Admin SDK is working correctly!",
        projectId,
        configured: true,
        stats: {
          totalUsers: listUsersResult.pageToken
            ? "More than 1 user"
            : listUsersResult.users.length,
          canAccessAuth: true,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Firebase Admin SDK Error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        message: "Failed to initialize or verify Firebase Admin SDK",
        configured: isFirebaseAdminConfigured(),
      },
      { status: 500 }
    );
  }
}
