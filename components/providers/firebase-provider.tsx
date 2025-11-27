"use client";

import { firebaseAuthConfig, firebaseConfig } from "@/lib/env";
import { configureAuth } from "@atechhub/firebase";
import { getApp, getApps, initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getDatabase, onValue, ref } from "firebase/database";
import { useEffect, useState } from "react";
import { useAppStore } from "@/hooks/use-app-store";
import { useAuthGuard } from "@/hooks/use-auth-guard";
import { Spinner } from "@/components/ui/spinner";
import {
  registerServiceWorker,
  initializeMessaging,
  onForegroundMessage,
} from "@/lib/utils/firebase-messaging";

interface FirebaseProviderProps {
  children: React.ReactNode;
}

export function FirebaseProvider({ children }: FirebaseProviderProps) {
  const setUser = useAppStore((state) => state.setUser);
  const [isInitializing, setIsInitializing] = useState(true);

  // Guard auth routes - redirect authenticated users away from these pages
  useAuthGuard(["/signin"]);

  useEffect(() => {
    try {
      // Initialize @atechhub/firebase auth
      configureAuth(firebaseAuthConfig);
      // Initialize Firebase app
      const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
      // Check if Firebase is initialized correctly
      console.log("Firebase initialized:", app.name);
      const auth = getAuth(app);
      const database = getDatabase(app);

      // Register service worker for push notifications (once on mount)
      if (typeof window !== "undefined" && "serviceWorker" in navigator) {
        registerServiceWorker().catch((error) => {
          console.error("Failed to register service worker:", error);
        });
      }

      onAuthStateChanged(auth, async (loggedInUser) => {
        if (loggedInUser?.uid) {
          // fetch data and update store
          const userRef = ref(database, `users/${loggedInUser.uid}`);
          onValue(userRef, async (snap) => {
            const userData = snap.val();
            if (userData) {
              setUser(userData);
              console.log("User data loaded:", userData);

              // Initialize messaging and get token when user is logged in
              if (typeof window !== "undefined") {
                try {
                  const token = await initializeMessaging(loggedInUser.uid);
                  if (token) {
                    console.log("FCM token obtained and saved");
                  }

                  // Set up foreground message listener
                  onForegroundMessage((payload) => {
                    console.log("Foreground message received:", payload);
                    // You can show a custom notification UI here if needed
                    // Or let the service worker handle it
                  });
                } catch (error) {
                  console.error("Failed to initialize messaging:", error);
                  // Don't block app initialization if messaging fails
                }
              }
            }
            setIsInitializing(false);
          });
        } else {
          setUser(null);
          setIsInitializing(false);
          console.log("User not logged in.");
        }
      });
    } catch (error) {
      console.error("Failed to initialize Firebase:", error);
      setIsInitializing(false);
    }
  }, [setUser]);

  if (isInitializing) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Spinner className="size-8" />
      </div>
    );
  }

  return <>{children}</>;
}
