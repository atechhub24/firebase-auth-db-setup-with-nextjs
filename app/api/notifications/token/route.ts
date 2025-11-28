import { NextResponse } from "next/server";
import { getDatabase, ref, set } from "firebase/database";
import { initializeApp, getApps, getApp } from "firebase/app";
import { firebaseConfig } from "@/lib/env";
import { z } from "zod";

// Validation schema
const saveTokenSchema = z.object({
  userId: z.string().min(1, "User ID is required"),
  token: z.string().min(1, "Token is required"),
  deviceInfo: z.string().optional(),
});

export async function POST(request: Request) {
  try {
    // Parse and validate request body
    const body = await request.json();
    const validationResult = saveTokenSchema.safeParse(body);

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

    const { userId, token, deviceInfo } = validationResult.data;

    // Initialize Firebase client SDK for database access
    const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
    const database = getDatabase(app);

    // Save token to notificationTokens/{userId}
    const tokenRef = ref(database, `notificationTokens/${userId}`);
    await set(tokenRef, {
      token,
      deviceInfo: deviceInfo || "Unknown device",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    return NextResponse.json(
      {
        success: true,
        message: "Token saved successfully",
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error saving notification token:", error);

    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error",
        message: "Failed to save notification token",
      },
      { status: 500 }
    );
  }
}

