import { useEffect, useState } from "react";

export const useTheme = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const userPreferences = {
    light: "dexter",
    dark: "dark",
    mode: "system",
  };

  useEffect(() => {
    // Add the event listener
    const removeListener = window.electron.onThemeChange(
      (theme: "light" | "dark") => {
        if (userPreferences.mode === "system") setTheme(theme);
      }
    );

    // Clean up the event listener when the component unmounts
    return () => {
      if (removeListener) removeListener();
    };
  }, []);

  return userPreferences[theme];
};
