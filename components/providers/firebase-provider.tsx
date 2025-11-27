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
import { toast } from "sonner";

interface FirebaseProviderProps {
  children: React.ReactNode;
}

export function FirebaseProvider({ children }: FirebaseProviderProps) {
  const setUser = useAppStore((state) => state.setUser);
  const [isInitializing, setIsInitializing] = useState(true);

  // Guard auth routes - redirect authenticated users away from these pages
  useAuthGuard(["/signin"]);

  useEffect(() => {
    let unsubscribeAuth: (() => void) | null = null;
    let unsubscribeUser: (() => void) | null = null;
    let unsubscribeForeground: (() => void) | null = null;

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

      unsubscribeAuth = onAuthStateChanged(auth, async (loggedInUser) => {
        // Cleanup previous subscriptions
        if (unsubscribeUser) {
          unsubscribeUser();
          unsubscribeUser = null;
        }
        if (unsubscribeForeground) {
          unsubscribeForeground();
          unsubscribeForeground = null;
        }

        if (loggedInUser?.uid) {
          // fetch data and update store
          const userRef = ref(database, `users/${loggedInUser.uid}`);
          unsubscribeUser = onValue(userRef, async (snap) => {
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
                  unsubscribeForeground = onForegroundMessage((payload) => {
                    console.log("Foreground message received:", payload);

                    const notificationTitle =
                      payload.notification?.title || "Notification";
                    const notificationBody = payload.notification?.body || "";
                    const clickAction =
                      payload.data?.url || payload.fcmOptions?.link;

                    // Show custom UI notification using Sonner toast
                    toast.custom(
                      (t) => (
                        <button
                          type="button"
                          className="w-full max-w-md rounded-lg border bg-card shadow-lg p-4 text-left cursor-pointer hover:shadow-xl transition-shadow"
                          onClick={() => {
                            toast.dismiss(t);
                            if (clickAction) {
                              window.location.href = clickAction;
                            }
                          }}
                        >
                          <div className="flex items-start gap-3">
                            {payload.notification?.icon && (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img
                                src={payload.notification.icon}
                                alt=""
                                className="h-10 w-10 rounded-full object-cover flex-shrink-0"
                                onError={(e) => {
                                  e.currentTarget.style.display = "none";
                                }}
                              />
                            )}
                            <div className="flex-1 space-y-1 min-w-0">
                              <div className="flex items-center justify-between gap-2">
                                <p className="text-sm font-semibold text-card-foreground truncate">
                                  {notificationTitle}
                                </p>
                                <button
                                  type="button"
                                  onClick={(e) => {
                                    e.stopPropagation();
                                    toast.dismiss(t);
                                  }}
                                  className="text-muted-foreground hover:text-foreground flex-shrink-0 text-xs"
                                  aria-label="Close notification"
                                >
                                  ✕
                                </button>
                              </div>
                              <p className="text-sm text-muted-foreground line-clamp-2">
                                {notificationBody}
                              </p>
                              {payload.notification?.image && (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={payload.notification.image}
                                  alt=""
                                  className="mt-2 w-full rounded-md object-cover max-h-32"
                                  onError={(e) => {
                                    e.currentTarget.style.display = "none";
                                  }}
                                />
                              )}
                            </div>
                          </div>
                        </button>
                      ),
                      {
                        duration: 5000,
                        position: "top-right",
                      }
                    );
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

    // Cleanup function
    return () => {
      if (unsubscribeForeground) {
        unsubscribeForeground();
      }
      if (unsubscribeUser) {
        unsubscribeUser();
      }
      if (unsubscribeAuth) {
        unsubscribeAuth();
      }
    };
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
