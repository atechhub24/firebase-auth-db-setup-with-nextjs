/* eslint-disable no-restricted-globals */
/* eslint-disable no-undef */
// Import Firebase scripts
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js");
importScripts("https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js");

let messaging = null;

// Initialize Firebase and messaging
async function initializeFirebase() {
  try {
    const response = await fetch("/api/firebase-config");
    const config = await response.json();

    if (!firebase.apps || firebase.apps.length === 0) {
      firebase.initializeApp(config);
      console.log("[firebase-messaging-sw.js] Firebase initialized");
    }

    messaging = firebase.messaging();
    console.log("[firebase-messaging-sw.js] Messaging initialized");

    // Set up message handlers
    setupMessageHandlers();
  } catch (error) {
    console.error("[firebase-messaging-sw.js] Failed to initialize:", error);
  }
}

// Set up message handlers
function setupMessageHandlers() {
  if (!messaging) {
    return;
  }

  // Handle background messages
  messaging.onBackgroundMessage((payload) => {
    console.log("[firebase-messaging-sw.js] Received background message ", payload);

    const notificationTitle = payload.notification?.title || "Notification";
    const notificationOptions = {
      body: payload.notification?.body || "",
      icon: payload.notification?.icon || "/icon.png",
      badge: payload.notification?.badge || "/badge.png",
      image: payload.notification?.image,
      tag: payload.notification?.tag,
      requireInteraction: false,
      data: {
        ...payload.data,
        ...(payload.fcmOptions?.link && { url: payload.fcmOptions.link }),
      },
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
  });
}

// Initialize on service worker activation
self.addEventListener("activate", (event) => {
  event.waitUntil(initializeFirebase());
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

// Initialize immediately if possible
if (self.registration) {
  initializeFirebase();
}
