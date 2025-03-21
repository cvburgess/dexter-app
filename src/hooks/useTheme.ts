import { useEffect, useState } from "react";

export type TTheme = "light" | "dark";
export type TThemeMode = TTheme | "system";

export const useTheme = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const userPreferences = { light: "dexter", dark: "dark", mode: "system" };

  useEffect(() => {
    // Get the theme from the system, or set it based on user preferences
    if (userPreferences.mode === "system") {
      window.electron.getTheme((theme: TTheme) => {
        setTheme(theme);
      });
    } else {
      window.electron.setThemeMode("set-native-theme", userPreferences.mode);
    }

    // Listen for changes to the os theme
    const removeListener = window.electron.onThemeChange((theme: TTheme) => {
      if (userPreferences.mode === "system") setTheme(theme);
    });

    // Clean up the event listener when the component unmounts
    return () => {
      if (removeListener) removeListener();
    };
  }, []);

  return userPreferences[theme];
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
