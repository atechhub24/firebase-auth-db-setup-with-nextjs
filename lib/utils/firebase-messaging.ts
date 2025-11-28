"use client";

import { getMessaging, getToken, onMessage, type MessagePayload } from "firebase/messaging";
import { getApp } from "firebase/app";
import { firebaseConfig, firebaseVapidConfig } from "@/lib/env";

let messaging: ReturnType<typeof getMessaging> | null = null;

/**
 * Initialize Firebase Messaging
 */
export function getFirebaseMessaging() {
  if (typeof window === "undefined") {
    return null;
  }

  if (!messaging) {
    try {
      const app = getApp();
      messaging = getMessaging(app);
    } catch (error) {
      console.error("Error initializing Firebase Messaging:", error);
      return null;
    }
  }

  return messaging;
}

/**
 * Request notification permission from the user
 */
export async function requestNotificationPermission(): Promise<NotificationPermission> {
  if (typeof window === "undefined" || !("Notification" in window)) {
    return "denied";
  }

  if (Notification.permission === "granted") {
    return "granted";
  }

  if (Notification.permission === "denied") {
    return "denied";
  }

  const permission = await Notification.requestPermission();
  return permission;
}

/**
 * Get FCM token for the current user/device
 */
export async function getFCMToken(): Promise<string | null> {
  if (typeof window === "undefined") {
    return null;
  }

  const messagingInstance = getFirebaseMessaging();
  if (!messagingInstance) {
    console.error("Firebase Messaging not initialized");
    return null;
  }

  try {
    const vapidKey = firebaseVapidConfig.publicKey;
    if (!vapidKey) {
      console.error("VAPID key not configured");
      return null;
    }

    const token = await getToken(messagingInstance, {
      vapidKey,
    });

    return token;
  } catch (error) {
    console.error("Error getting FCM token:", error);
    return null;
  }
}

/**
 * Save notification token to Firebase Database
 */
export async function saveNotificationToken(
  userId: string,
  token: string,
  deviceInfo?: string
): Promise<boolean> {
  try {
    const response = await fetch("/api/notifications/token", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        userId,
        token,
        deviceInfo: deviceInfo || navigator.userAgent,
      }),
    });

    return response.ok;
  } catch (error) {
    console.error("Error saving notification token:", error);
    return false;
  }
}

/**
 * Initialize messaging and get token
 * Call this when user logs in
 */
export async function initializeMessaging(userId: string): Promise<string | null> {
  if (typeof window === "undefined") {
    return null;
  }

  // Request permission
  const permission = await requestNotificationPermission();
  if (permission !== "granted") {
    console.warn("Notification permission not granted:", permission);
    return null;
  }

  // Get FCM token
  const token = await getFCMToken();
  if (!token) {
    console.error("Failed to get FCM token");
    return null;
  }

  // Save token to database
  const saved = await saveNotificationToken(userId, token);
  if (!saved) {
    console.error("Failed to save notification token");
    // Still return token even if save failed
  }

  return token;
}

/**
 * Listen for foreground messages
 */
export function onForegroundMessage(
  callback: (payload: MessagePayload) => void
): (() => void) | null {
  if (typeof window === "undefined") {
    return null;
  }

  const messagingInstance = getFirebaseMessaging();
  if (!messagingInstance) {
    return null;
  }

  try {
    return onMessage(messagingInstance, callback);
  } catch (error) {
    console.error("Error setting up foreground message listener:", error);
    return null;
  }
}

/**
 * Register service worker for push notifications
 */
export async function registerServiceWorker(): Promise<ServiceWorkerRegistration | null> {
  if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
    return null;
  }

  try {
    const registration = await navigator.serviceWorker.register("/firebase-messaging-sw.js", {
      scope: "/",
    });

    console.log("Service Worker registered:", registration);
    return registration;
  } catch (error) {
    console.error("Error registering service worker:", error);
    return null;
  }
}

