import { useEffect, useState } from "react";
// import { listen, TauriEvent } from "@tauri-apps/api/event";

export const useTheme = () => {
  const [theme, setTheme] = useState("light");
  //   globalThis.matchMedia("(prefers-color-scheme: dark)").matches
  //     ? "dark"
  //     : "dexter",
  // );

  // useEffect(() => {
  //   // Initial theme detection
  //   const mediaQuery = globalThis.matchMedia("(prefers-color-scheme: dark)");

  //   const lightTheme = "dexter";
  //   const darkTheme = "dark";
  //   const updateTheme = (e: MediaQueryListEvent) =>
  //     setTheme(e.matches ? darkTheme : lightTheme);

  //   // Listen for OS theme changes
  //   mediaQuery.addEventListener("change", updateTheme);

  //   // Listen for Tauri theme change events
  //   const unlisten = listen(TauriEvent.WINDOW_THEME_CHANGED, (event) => {
  //     const payload = event.payload as { theme: string };
  //     setTheme(payload.theme);
  //   });

  //   return () => {
  //     mediaQuery.removeEventListener("change", updateTheme);
  //     unlisten.then((fn) => fn());
  //   };
  // }, []);

  return theme;
};
