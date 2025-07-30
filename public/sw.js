// Service Worker for PWA badge functionality
import { precacheAndRoute } from "workbox-precaching";

// Precache and route assets
precacheAndRoute(self.__WB_MANIFEST);

let SUPABASE_URL = "https://isreileykodwkyedcewv.supabase.co"; // Default fallback
const CACHE_NAME = "dexter-badge-cache-v1";
const BADGE_UPDATE_INTERVAL = 15 * 60 * 1000; // 15 minutes in milliseconds

let badgeUpdateTimer = null;

// Install event - set up cache
self.addEventListener("install", (event) => {
  console.log("Service Worker: Installing");
  self.skipWaiting();
});

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  console.log("Service Worker: Activating");
  event.waitUntil(self.clients.claim());

  // Start background badge updates
  startBadgeUpdates();
});

// Message event - handle messages from main thread
self.addEventListener("message", (event) => {
  const { type, data } = event.data;

  switch (type) {
    case "UPDATE_BADGE":
      updateBadge(data.count);
      break;
    case "GET_TODAY_TASKS_COUNT":
      getTodayTasksCount().then((count) => {
        event.ports[0].postMessage({ type: "TODAY_TASKS_COUNT", count });
      });
      break;
    case "SET_AUTH_TOKEN":
      // Store auth token for background requests
      self.authToken = data.token;
      break;
    case "SET_SUPABASE_URL":
      // Store Supabase URL for API calls
      SUPABASE_URL = data.url;
      console.log("Service Worker: Supabase URL set to", SUPABASE_URL);
      break;
    default:
      console.log("Service Worker: Unknown message type:", type);
  }
});

// Function to update the app badge
async function updateBadge(count) {
  try {
    if ("setAppBadge" in navigator) {
      if (count > 0) {
        await navigator.setAppBadge(count);
        console.log(`Service Worker: Badge updated to ${count}`);
      } else {
        await navigator.clearAppBadge();
        console.log("Service Worker: Badge cleared");
      }
    } else {
      console.log("Service Worker: setAppBadge not supported");
    }
  } catch (error) {
    console.error("Service Worker: Error updating badge:", error);
  }
}

// Function to get today's incomplete tasks count
async function getTodayTasksCount() {
  try {
    if (!self.authToken) {
      console.log("Service Worker: No auth token available");
      return 0;
    }

    const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD format

    const response = await fetch(
      `${SUPABASE_URL}/rest/v1/tasks?scheduled_for=eq.${today}&status=in.(0,1)&select=id`,
      {
        headers: {
          Authorization: `Bearer ${self.authToken}`,
          apikey: self.authToken, // Supabase requires both headers
          "Content-Type": "application/json",
        },
      },
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const tasks = await response.json();
    const count = tasks.length;

    console.log(`Service Worker: Found ${count} incomplete tasks for today`);
    return count;
  } catch (error) {
    console.error("Service Worker: Error fetching today tasks count:", error);
    return 0;
  }
}

// Function to start periodic badge updates
function startBadgeUpdates() {
  // Clear any existing timer
  if (badgeUpdateTimer) {
    clearInterval(badgeUpdateTimer);
  }

  // Set up periodic updates every 15 minutes
  badgeUpdateTimer = setInterval(async () => {
    console.log("Service Worker: Periodic badge update");
    const count = await getTodayTasksCount();
    await updateBadge(count);
  }, BADGE_UPDATE_INTERVAL);

  console.log("Service Worker: Badge update timer started");
}

// Handle background sync for immediate updates
self.addEventListener("sync", (event) => {
  if (event.tag === "update-badge") {
    event.waitUntil(getTodayTasksCount().then((count) => updateBadge(count)));
  }
});

// Handle push messages (if needed for future enhancements)
self.addEventListener("push", (event) => {
  // This could be used for server-sent badge updates in the future
  console.log("Service Worker: Push message received");
});
