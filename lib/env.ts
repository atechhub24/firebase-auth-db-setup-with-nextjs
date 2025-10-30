import { z } from "zod";

// Define the schema for environment variables
const envSchema = z.object({
  // Firebase Configuration
  NEXT_PUBLIC_FIREBASE_API_KEY: z
    .string()
    .min(1, "Firebase API Key is required"),
  NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN: z
    .string()
    .min(1, "Firebase Auth Domain is required"),
  NEXT_PUBLIC_FIREBASE_DATABASE_URL: z
    .string()
    .min(1, "Firebase Database URL is required"),
  NEXT_PUBLIC_FIREBASE_PROJECT_ID: z
    .string()
    .min(1, "Firebase Project ID is required"),
  NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET: z
    .string()
    .min(1, "Firebase Storage Bucket is required"),
  NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: z
    .string()
    .min(1, "Firebase Messaging Sender ID is required"),
  NEXT_PUBLIC_FIREBASE_APP_ID: z.string().min(1, "Firebase App ID is required"),
  NEXT_PUBLIC_FIREBASE_AUTH_URL: z
    .string()
    .url("Firebase Auth URL must be a valid URL"),
  // UploadThing Configuration
  UPLOADTHING_TOKEN: z.string().min(1, "UploadThing token is required"),
});

// Validate and parse environment variables
function validateEnv() {
  try {
    return envSchema.parse({
      NEXT_PUBLIC_FIREBASE_API_KEY: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
      NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN:
        process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
      NEXT_PUBLIC_FIREBASE_DATABASE_URL:
        process.env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
      NEXT_PUBLIC_FIREBASE_PROJECT_ID:
        process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
      NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET:
        process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
      NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID:
        process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
      NEXT_PUBLIC_FIREBASE_APP_ID: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
      NEXT_PUBLIC_FIREBASE_AUTH_URL: process.env.NEXT_PUBLIC_FIREBASE_AUTH_URL,
      UPLOADTHING_TOKEN: process.env.UPLOADTHING_TOKEN,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      const missingVars = error.issues.map(
        (err) => `${err.path.join(".")}: ${err.message}`
      );
      throw new Error(
        "Invalid environment variables:\n" +
          missingVars.join("\n") +
          "\n\nPlease check your .env.local file."
      );
    }
    throw error;
  }
}

// Export type-safe environment variables
export const env = validateEnv();

// Export types for use in other files
export type Env = z.infer<typeof envSchema>;

// Firebase configuration object
export const firebaseConfig = {
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
  authDomain: env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
  databaseURL: env.NEXT_PUBLIC_FIREBASE_DATABASE_URL,
  projectId: env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: env.NEXT_PUBLIC_FIREBASE_APP_ID,
};

// Firebase Auth API configuration
export const firebaseAuthConfig = {
  authUrl: env.NEXT_PUBLIC_FIREBASE_AUTH_URL,
  apiKey: env.NEXT_PUBLIC_FIREBASE_API_KEY,
};
