import { useState, useEffect } from "react";

const isWeb = !window.electron;

export const useFullScreen = () => {
  // Treat web as fullscreen because it has no window chrome
  const [isFullScreen, setIsFullScreen] = useState(isWeb);

  useEffect(() => {
    // Do nothing on web
    if (!window.electron) {
      return undefined;
    }

    // Get initial fullscreen state
    window.electron.getFullscreenState().then(setIsFullScreen);

    // Set up listener for fullscreen state changes
    const unsubscribe = window.electron.onFullscreenChange(setIsFullScreen);

    // Clean up listener on unmount
    return unsubscribe;
  }, []);

  return isFullScreen;
};
