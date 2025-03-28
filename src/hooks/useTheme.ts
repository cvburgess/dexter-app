import { useEffect, useState } from "react";

import { usePreferences } from "./usePreferences";
import { EThemeMode } from "../api/preferences";

export type TTheme = "light" | "dark";
export type TThemeMode = TTheme | "system";

const isElectron = Boolean(window.electron);

export const useTheme = () => {
  const [themeMode, setThemeMode] = useState<TTheme>("light");
  const [preferences] = usePreferences();

  const modes: TThemeMode[] = ["system", "light", "dark"];

  useEffect(() => {
    // Get the theme from the system, or set it based on user preferences
    if (preferences.themeMode === EThemeMode.SYSTEM) {
      if (isElectron) {
        window.electron.setThemeMode(modes[EThemeMode.SYSTEM]);
        window.electron.getTheme((theme: TTheme) => {
          setThemeMode(theme);
        });
      } else {
        const isDark = window.matchMedia?.(
          "(prefers-color-scheme: dark)",
        ).matches;
        setThemeMode(isDark ? "dark" : "light");
      }
    } else {
      if (isElectron) {
        window.electron.setThemeMode(modes[preferences.themeMode]);
      }
      setThemeMode(modes[preferences.themeMode] as TTheme);
    }

    // Listen for changes to the os/browser theme
    const removeListener = isElectron
      ? window.electron.onThemeChange((theme: TTheme) => {
          if (preferences.themeMode === EThemeMode.SYSTEM) setThemeMode(theme);
        })
      : window
          .matchMedia("(prefers-color-scheme: dark)")
          .addEventListener("change", (event) => {
            if (preferences.themeMode === EThemeMode.SYSTEM) {
              setThemeMode(event.matches ? "dark" : "light");
            }
          });

    // Clean up the event listener when the component unmounts
    return () => {
      if (removeListener) removeListener();
    };
  }, [preferences.themeMode]);

  return preferences[`${themeMode}Theme`];
};

export const THEMES = [
  { name: "abyss", mode: "dark" },
  { name: "acid", mode: "light" },
  { name: "aqua", mode: "dark" },
  { name: "autumn", mode: "light" },
  { name: "black", mode: "dark" },
  { name: "bumblebee", mode: "light" },
  { name: "business", mode: "dark" },
  { name: "caramellatte", mode: "light" },
  { name: "cmyk", mode: "light" },
  { name: "coffee", mode: "dark" },
  { name: "corporate", mode: "light" },
  { name: "cupcake", mode: "light" },
  { name: "cyberpunk", mode: "light" },
  { name: "dark", mode: "dark" },
  { name: "dexter", mode: "light" },
  { name: "dim", mode: "dark" },
  { name: "dracula", mode: "dark" },
  { name: "emerald", mode: "light" },
  { name: "fantasy", mode: "light" },
  { name: "forest", mode: "dark" },
  { name: "garden", mode: "light" },
  { name: "halloween", mode: "dark" },
  { name: "lemonade", mode: "light" },
  { name: "light", mode: "light" },
  { name: "lofi", mode: "light" },
  { name: "luxury", mode: "dark" },
  { name: "night", mode: "dark" },
  { name: "nord", mode: "light" },
  { name: "pastel", mode: "light" },
  { name: "retro", mode: "light" },
  { name: "silk", mode: "light" },
  { name: "sunset", mode: "dark" },
  { name: "synthwave", mode: "dark" },
  { name: "valentine", mode: "light" },
  { name: "winter", mode: "light" },
  { name: "wireframe", mode: "light" },
];
