import { contextBridge, ipcRenderer } from "electron";

import type { TToken } from "./hooks/useAuth.tsx";
import type { TTheme, TThemeMode } from "./hooks/useTheme.tsx";

// Declare electron property on window object
declare global {
  interface Window {
    electron: {
      getFullscreenState: () => Promise<boolean>;
      onFullscreenChange: (
        callback: (isFullScreen: boolean) => void,
      ) => () => void;
      onSupabaseAuthCallback: (callback: (token: TToken) => void) => () => void;
      setThemeMode: (mode: TThemeMode) => void;
      getTheme: (callback: (theme: TTheme) => void) => void;
      onThemeChange: (
        callback: (theme: TTheme) => void,
      ) => (() => void) | undefined;
      onGoToRoute: (
        callback: (route: string) => void,
      ) => (() => void) | undefined;
      onToggleQuickPlanner: (callback: () => void) => (() => void) | undefined;
    };
  }
}

contextBridge.exposeInMainWorld("electron", {
  // ---------- WINDOW ----------
  getFullscreenState: () => ipcRenderer.invoke("window-get-fullscreen-state"),

  onFullscreenChange: (callback: (isFullScreen: boolean) => void) => {
    ipcRenderer.on("window-fullscreen-changed", (_, isFullScreen) =>
      callback(isFullScreen),
    );

    // Return unsubscribe function
    return () => {
      ipcRenderer.removeAllListeners("window:fullscreen-changed");
    };
  },
  // ---------- AUTH ----------
  onSupabaseAuthCallback: (callback: (token: TToken) => void) => {
    ipcRenderer.on("supabase-auth-callback", (_event, value) => {
      const token = urlToObj(value) as Omit<TToken, "user">;
      callback(token);
    });

    // Return a function to remove the listener
    return () => {
      ipcRenderer.removeAllListeners("supabase-auth-callback");
    };
  },

  // ---------- THEME ----------
  getTheme: (callback: (theme: TTheme) => void) => {
    ipcRenderer.invoke("get-native-theme").then((theme: TTheme) => {
      callback(theme);
    });
  },
  onThemeChange: (callback: (theme: TTheme) => void) => {
    ipcRenderer.on("os-theme-changed", (_event, value) => {
      callback(value);
    });

    // Return a function to remove the listener
    return () => {
      ipcRenderer.removeAllListeners("os-theme-changed");
    };
  },
  setThemeMode: (mode: TThemeMode) => {
    ipcRenderer.invoke("set-native-theme", mode);
  },

  // ---------- SHORTCUTS ----------
  onGoToRoute: (callback: (route: string) => void) => {
    ipcRenderer.on("go-to-route", (_event, route) => {
      callback(route);
    });

    // Return a function to remove the listener
    return () => {
      ipcRenderer.removeAllListeners("go-to-route");
    };
  },
  onToggleQuickPlanner: (callback: () => void) => {
    ipcRenderer.on("toggle-quick-planner", (_event) => {
      callback();
    });

    // Return a function to remove the listener
    return () => {
      ipcRenderer.removeAllListeners("toggle-quick-planner");
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
