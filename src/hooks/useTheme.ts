import { useEffect, useState } from "react";

export type TTheme = "light" | "dark";
export type TThemeMode = TTheme | "system";

export const useTheme = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const userPreferences = {
    light: "dexter",
    dark: "dark",
    mode: "system",
  };

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
