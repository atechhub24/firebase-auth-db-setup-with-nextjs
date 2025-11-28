import { NextResponse } from "next/server";
import {
  firebaseAdminConfig,
  isFirebaseAdminConfigured,
} from "@/lib/env";
import { notificationService } from "@/lib/services/notification.service";
import type { NotificationSendRequest } from "@/lib/types/notification.type";
import { z } from "zod";

// Lazy import firebase-admin to avoid bundling issues
let admin: typeof import("firebase-admin") | null = null;

async function getAdmin() {
  if (!admin) {
    admin = await import("firebase-admin");
  }
  return admin;
}

// Validation schema
const sendNotificationSchema = z.object({
  userIds: z.array(z.string().min(1)).min(1, "At least one user ID is required"),
  payload: z.object({
    title: z.string().min(1, "Title is required"),
    body: z.string().min(1, "Description is required"),
    image: z.string().url().optional(),
    icon: z.string().url().optional(),
    clickAction: z.string().url().optional(),
    priority: z.enum(["normal", "high"]).optional(),
    sound: z.string().optional(),
    tag: z.string().optional(),
    badge: z.string().optional(),
    data: z.record(z.string(), z.string()).optional(),
  }),
});

export async function POST(request: Request) {
  try {
    // Check if Firebase Admin is configured
    if (!isFirebaseAdminConfigured()) {
      return NextResponse.json(
        {
          success: false,
          error: "Firebase Admin SDK is not configured",
          message:
            "Please ensure FIREBASE_PROJECT_ID, FIREBASE_CLIENT_EMAIL, and FIREBASE_PRIVATE_KEY are set in your environment variables",
        },
        { status: 400 }
      );
    }

    // Parse and validate request body
    const body = await request.json();
    const validationResult = sendNotificationSchema.safeParse(body);

    if (!validationResult.success) {
      return NextResponse.json(
        {
          success: false,
          error: "Invalid request data",
          details: validationResult.error.issues,
        },
        { status: 400 }
      );
    }

    const { userIds, payload }: NotificationSendRequest = validationResult.data;

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

    // Get messaging instance
    const messaging = firebaseAdmin.messaging(app);

    // Send notifications
    const results = await notificationService.sendNotification(
      messaging,
      userIds,
      payload
    );

    const totalSent = results.filter((r) => r.success).length;
    const totalFailed = results.filter((r) => !r.success).length;

    return NextResponse.json(
      {
        success: totalSent > 0,
        results,
        totalSent,
        totalFailed,
        message:
          totalSent > 0
            ? `Successfully sent ${totalSent} notification(s)`
            : "Failed to send notifications",
      },
      { status: totalSent > 0 ? 200 : 500 }
    );
  } catch (error) {
    console.error("Notification send error:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        message: "Failed to send notifications",
      },
      { status: 500 }
    );
  }
}

