// Service Worker for PWA badge functionality
// Note: Import statements work differently in service workers
// Import workbox if available, otherwise continue without precaching
if (typeof importScripts === "function") {
  try {
    importScripts(
      "https://storage.googleapis.com/workbox-cdn/releases/7.3.0/workbox-sw.js",
    );
    if (workbox) {
      workbox.precaching.precacheAndRoute(self.__WB_MANIFEST || []);
    }
  } catch (e) {
    console.log(
      "Service Worker: Workbox not available, continuing without precaching",
    );
  }
}

// No background fetching needed - badges updated from foreground only

// Install event - set up cache
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing");
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating");
  event.waitUntil(self.clients.claim());
});

// Message event - handle messages from main thread
self.addEventListener("message", (event) => {
  const { type, data } = event.data;

  switch (type) {
    case "UPDATE_BADGE":
      updateBadge(data.count);
      break;
    default:
      console.log("Service Worker: Unknown message type:", type);
  }
});

// Function to update the app badge
async function updateBadge(count) {
  try {
    // In service worker context, we need to use self.navigator or check if it exists
    const nav = self.navigator || navigator;
    if (nav && "setAppBadge" in nav) {
      if (count > 0) {
        await nav.setAppBadge(count);
        console.log(`Service Worker: Badge updated to ${count}`);
      } else {
        await nav.clearAppBadge();
        console.log("Service Worker: Badge cleared");
      }
    } else {
      console.log("Service Worker: setAppBadge not supported");
    }
  } catch (error) {
    console.error("Service Worker: Error updating badge:", error);
  }
}
