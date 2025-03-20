import path from "node:path";
import { app, BrowserWindow, ipcMain, nativeTheme, shell } from "electron";
import started from "electron-squirrel-startup";

let mainWindow: BrowserWindow;

const darkBackgroundColor = "black";
const lightBackgroundColor = "white";

const handleThemeChange = () => {
  const theme = nativeTheme.shouldUseDarkColors ? "dark" : "light";
  const backgroundColor = nativeTheme.shouldUseDarkColors
    ? darkBackgroundColor
    : lightBackgroundColor;

  mainWindow.setBackgroundColor(backgroundColor);
  mainWindow.webContents.send("os-theme-changed", theme);
};

// Handle creating/removing shortcuts on Windows when installing/uninstalling.
if (started) {
  app.quit();
}

if (process.defaultApp) {
  if (process.argv.length >= 2) {
    app.setAsDefaultProtocolClient("dexter", process.execPath, [
      path.resolve(process.argv[1]),
    ]);
  }
} else {
  app.setAsDefaultProtocolClient("dexter");
}

const createWindow = () => {
  // Create the browser window.
  mainWindow = new BrowserWindow({
    backgroundColor: nativeTheme.shouldUseDarkColors
      ? darkBackgroundColor
      : lightBackgroundColor,
    show: false,
    width: 800,
    height: 600,
    webPreferences: { preload: path.join(__dirname, "preload.js") },
    titleBarStyle: "hidden",
    trafficLightPosition: { x: 12, y: 18 },
    ...(process.platform !== "darwin" ? { titleBarOverlay: true } : {}),
  });

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  // and load the index.html of the app.
  if (MAIN_WINDOW_VITE_DEV_SERVER_URL) {
    mainWindow.loadURL(MAIN_WINDOW_VITE_DEV_SERVER_URL);
  } else {
    mainWindow.loadFile(
      path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
    );
  }

  mainWindow.webContents.setWindowOpenHandler((details) => {
    shell.openExternal(details.url); // Open URL in user's browser.
    return { action: "deny" }; // Prevent the app from opening the URL.
  });

  handleThemeChange();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

app.on("open-url", (_event, url) => {
  mainWindow.focus();
  mainWindow.webContents.send("supabase-auth-callback", url);
});

nativeTheme.on("updated", handleThemeChange);

ipcMain.handle("get-native-theme", () => {
  return nativeTheme.shouldUseDarkColors ? "dark" : "light";
});

ipcMain.handle(
  "set-native-theme",
  (_, themeSource: "light" | "dark" | "system") => {
    nativeTheme.themeSource = themeSource;
  },
);

// Quit when all windows are closed, except on macOS. There, it's common
// for applications and their menu bar to stay active until the user quits
// explicitly with Cmd + Q.
app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// In this file you can include the rest of your app's specific main process
// code. You can also put them in separate files and import them here.
