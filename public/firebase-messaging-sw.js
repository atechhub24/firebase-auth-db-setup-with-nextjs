/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
// Import Firebase scripts
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

let messaging = null;
let isInitialized = false;

// Initialize Firebase and messaging
async function initializeFirebase() {
  if (isInitialized && messaging) {
    return;
  }

  try {
    const response = await fetch("/api/firebase-config");
    const config = await response.json();

    if (!firebase.apps || firebase.apps.length === 0) {
      firebase.initializeApp(config);
      console.log("[firebase-messaging-sw.js] Firebase initialized");
    }

    messaging = firebase.messaging();
    console.log("[firebase-messaging-sw.js] Messaging initialized");
    isInitialized = true;

    // Set up message handlers
    setupMessageHandlers();
  } catch (error) {
    console.error("[firebase-messaging-sw.js] Failed to initialize:", error);
  }
}

// Set up message handlers
function setupMessageHandlers() {
  if (!messaging) {
    console.warn("[firebase-messaging-sw.js] Messaging not available");
    return;
  }

  // Handle background messages
  messaging.onBackgroundMessage((payload) => {
    console.log("[firebase-messaging-sw.js] Received background message ", payload);

    const notificationTitle = payload.notification?.title || "Notification";
    const notificationBody = payload.notification?.body || "";
    
    console.log("[firebase-messaging-sw.js] Preparing to show notification:", {
      title: notificationTitle,
      body: notificationBody,
    });

    const clickAction = payload.data?.url || 
                        payload.fcmOptions?.link || 
                        payload.webpush?.fcmOptions?.link || 
                        "/";

    // Handle icon path - use .svg if .png is requested and doesn't exist
    let iconPath = payload.notification?.icon || "/icon.svg";
    if (iconPath === "/icon.png") {
      iconPath = "/icon.svg"; // Fallback to .svg if .png was requested
    }

    const notificationOptions = {
      body: notificationBody,
      icon: iconPath,
      badge: "/badge.svg",
      image: payload.notification?.image,
      tag: payload.notification?.tag || `notification-${Date.now()}`,
      requireInteraction: false,
      data: {
        url: clickAction,
        ...(payload.data || {}),
      },
    };

    console.log("[firebase-messaging-sw.js] Notification options:", notificationOptions);

    // Ensure registration is available before showing notification
    if (self.registration) {
      console.log("[firebase-messaging-sw.js] Service worker registration available, showing notification");
      return self.registration.showNotification(notificationTitle, notificationOptions)
        .then(() => {
          console.log("[firebase-messaging-sw.js] Notification shown successfully");
        })
        .catch((error) => {
          console.error("[firebase-messaging-sw.js] Failed to show notification:", error);
        });
    } else {
      console.error("[firebase-messaging-sw.js] Service worker registration not available");
    }
  });
}

// Initialize on service worker activation
self.addEventListener("activate", (event) => {
  event.waitUntil(initializeFirebase());
});

// Initialize immediately on install
self.addEventListener("install", (event) => {
  event.waitUntil(initializeFirebase());
  self.skipWaiting();
});

// Handle notification clicks
self.addEventListener("notificationclick", (event) => {
  console.log("[firebase-messaging-sw.js] Notification click received.");

  event.notification.close();

  // Get the URL from notification data or use default
  const urlToOpen = event.notification.data?.url || "/";

  event.waitUntil(
    clients.matchAll({ type: "window", includeUncontrolled: true }).then((clientList) => {
      // Check if there's already a window/tab open with the target URL
      for (const client of clientList) {
        if (client.url === urlToOpen && "focus" in client) {
          return client.focus();
        }
      }
      // If not, open a new window/tab
      if (clients.openWindow) {
        return clients.openWindow(urlToOpen);
      }
    })
  );
});

// Initialize immediately
initializeFirebase();
