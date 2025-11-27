import { NextResponse } from "next/server";
import { firebaseConfig } from "@/lib/env";

export async function GET() {
  // Return Firebase config for service worker
  return NextResponse.json({
    apiKey: firebaseConfig.apiKey,
    authDomain: firebaseConfig.authDomain,
    projectId: firebaseConfig.projectId,
    storageBucket: firebaseConfig.storageBucket,
    messagingSenderId: firebaseConfig.messagingSenderId,
    appId: firebaseConfig.appId,
  });
}

