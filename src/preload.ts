import { contextBridge, ipcRenderer } from "electron";

import type { TToken } from "./hooks/useAuth.tsx";

// Expose protected methods that allow the renderer process to use
// the ipcRenderer without exposing the entire object
contextBridge.exposeInMainWorld("electron", {
  // For receiving messages
  onSupabaseAuthCallback: (callback: (token: TToken) => void) => {
    ipcRenderer.on("supabase-auth-callback", (_event, value) => {
      const token = urlToObj(value) as TToken;
      callback(token);
    });

    // Return a function to remove the listener
    return () => {
      ipcRenderer.removeAllListeners("supabase-auth-callback");
    };
  },
  onThemeChange: (callback: (theme: "light" | "dark") => void) => {
    ipcRenderer.on("os-theme-changed", (_event, value) => {
      callback(value);
    });

    // Return a function to remove the listener
    return () => {
      ipcRenderer.removeAllListeners("os-theme-changed");
    };
  },
});

const urlToObj = (url: string) => {
  // Parse the base URL
  const parsedUrl = new URL(url);

  // Get the hash fragment (removing the # character)
  const hashFragment = parsedUrl.hash.substring(1);

  // Parse the hash fragment like a query string
  const fragmentParams = new URLSearchParams(hashFragment);

  // Convert to an object
  return Object.fromEntries(fragmentParams.entries());
};

// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
