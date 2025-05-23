import path from "path";
import {
  app,
  BrowserWindow,
  ipcMain,
  Menu,
  MenuItem,
  MenuItemConstructorOptions,
  nativeTheme,
  shell,
} from "electron";
import {
  installExtension,
  REACT_DEVELOPER_TOOLS,
} from "electron-devtools-installer";
import { updateElectronApp } from "update-electron-app";
import windowStateKeeper from "electron-window-state";

const isMac = process.platform === "darwin";

let mainWindow: BrowserWindow;

const darkBackgroundColor = "black";
const lightBackgroundColor = "white";

updateElectronApp();

const handleThemeChange = () => {
  // Check if mainWindow exists and is not destroyed
  if (!mainWindow || mainWindow.isDestroyed()) {
    return;
  }

  const theme = nativeTheme.shouldUseDarkColors ? "dark" : "light";
  const backgroundColor = nativeTheme.shouldUseDarkColors
    ? darkBackgroundColor
    : lightBackgroundColor;

  mainWindow.setBackgroundColor(backgroundColor);
  mainWindow.webContents.send("os-theme-changed", theme);
};

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
  // Load the previous state with fallback to defaults
  const mainWindowState = windowStateKeeper({
    defaultWidth: 800,
    defaultHeight: 600,
  });

  // Create the browser window.
  mainWindow = new BrowserWindow({
    x: mainWindowState.x,
    y: mainWindowState.y,
    width: mainWindowState.width,
    height: mainWindowState.height,
    backgroundColor: nativeTheme.shouldUseDarkColors
      ? darkBackgroundColor
      : lightBackgroundColor,
    show: false,
    minWidth: 512,
    minHeight: 512,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      nodeIntegration: false,
      webSecurity: true,
    },
    titleBarStyle: "hidden",
    trafficLightPosition: { x: 10, y: 10 },
    ...(process.platform !== "darwin" ? { titleBarOverlay: true } : {}),
  });

  // Manage the window state
  mainWindowState.manage(mainWindow);

  // Listen for fullscreen changes
  mainWindow.on("enter-full-screen", () => {
    mainWindow?.webContents.send("window-fullscreen-changed", true);
  });

  mainWindow.on("leave-full-screen", () => {
    mainWindow?.webContents.send("window-fullscreen-changed", false);
  });

  mainWindow.once("ready-to-show", () => {
    mainWindow.show();
  });

  mainWindow.webContents.on("did-fail-load", () => {
    if (process.env.NODE_ENV === "production") {
      // Load the index URL the same way you load it above
      mainWindow.loadFile(
        path.join(__dirname, `../renderer/${MAIN_WINDOW_VITE_NAME}/index.html`),
      );
    }
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

  // ---------- CONTEXT MENU ----------

  mainWindow.webContents.on("context-menu", (event, params) => {
    const menu = new Menu();

    // Add each spelling suggestion
    for (const suggestion of params.dictionarySuggestions) {
      menu.append(
        new MenuItem({
          label: suggestion,
          click: () => mainWindow.webContents.replaceMisspelling(suggestion),
        }),
      );
    }

    if (params.dictionarySuggestions?.length) {
      menu.append(new MenuItem({ type: "separator" }));
    }

    // Allow users to add the misspelled word to the dictionary
    if (params.misspelledWord) {
      menu.append(
        new MenuItem({
          label: "Add to dictionary",
          click: () =>
            mainWindow.webContents.session.addWordToSpellCheckerDictionary(
              params.misspelledWord,
            ),
        }),
      );
      menu.append(new MenuItem({ type: "separator" }));
    }

    // Add the default context menu items
    // menu.append(new MenuItem({ role: "undo" }));
    // menu.append(new MenuItem({ role: "redo" }));
    menu.append(new MenuItem({ type: "separator" }));
    menu.append(new MenuItem({ role: "cut" }));
    menu.append(new MenuItem({ role: "copy" }));
    menu.append(new MenuItem({ role: "paste" }));
    menu.append(new MenuItem({ role: "selectAll" }));

    menu.popup();
  });

  handleThemeChange();
};

// This method will be called when Electron has finished
// initialization and is ready to create browser windows.
// Some APIs can only be used after this event occurs.
app.on("ready", createWindow);

app.whenReady().then(() => {
  // Handle fullscreen state requests
  ipcMain.handle("window-get-fullscreen-state", () => {
    return mainWindow?.isFullScreen();
  });

  if (!app.isPackaged) {
    installExtension(REACT_DEVELOPER_TOOLS, {
      loadExtensionOptions: { allowFileAccess: true },
    })
      .then((ext) => console.log(`Added Extension:  ${ext.name}`))
      .catch((err) => console.log("An error occurred: ", err));
  }
});

app.on("open-url", (_event, url) => {
  if (mainWindow) {
    mainWindow.focus();
    mainWindow.webContents.send("supabase-auth-callback", url);
  }
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

app.on("will-quit", () => {
  ipcMain.removeHandler("window-get-fullscreen-state");
});

app.on("activate", () => {
  // On OS X it's common to re-create a window in the app when the
  // dock icon is clicked and there are no other windows open.
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

// ---------- MENUS ----------

const goToRoute = (route: string) => {
  if (mainWindow) {
    mainWindow.focus();
    mainWindow.webContents.send("go-to-route", route);
  }
};

const toggleQuickPlanner = () => {
  if (mainWindow) {
    mainWindow.focus();
    mainWindow.webContents.send("toggle-quick-planner");
  }
};

const template: Array<MenuItemConstructorOptions> = [
  ...((isMac ? [{ role: "appMenu" }] : []) as MenuItemConstructorOptions[]),
  { role: "fileMenu" },
  {
    label: "Edit",
    submenu: [
      // { role: "undo" },
      // { role: "redo" },
      // { type: "separator" },
      { role: "cut" },
      { role: "copy" },
      { role: "paste" },
      { role: "pasteAndMatchStyle" },
      ...((isMac
        ? [
            { role: "delete" },
            { role: "selectAll" },
            { type: "separator" },
            {
              label: "Speech",
              submenu: [{ role: "startSpeaking" }, { role: "stopSpeaking" }],
            },
          ]
        : [
            { role: "delete" },
            { type: "separator" },
            { role: "selectAll" },
          ]) as MenuItemConstructorOptions[]),
    ],
  },
  // { role: 'viewMenu' }
  {
    label: "View",
    submenu: [
      // ...(app.isPackaged
      //   ? [] // No dev tools in production
      //   : ([
      ...([
        { role: "reload" },
        { role: "forceReload" },
        { role: "toggleDevTools" },
        { type: "separator" },
      ] as MenuItemConstructorOptions[]),

      { role: "resetZoom" },
      { role: "zoomIn" },
      { role: "zoomOut" },
      { type: "separator" },

      { role: "togglefullscreen" },

      { type: "separator" },
      {
        label: "Day",
        accelerator: isMac ? "Cmd+1" : "Ctrl+1",
        click: () => goToRoute("/"),
      },
      {
        label: "Week",
        accelerator: isMac ? "Cmd+2" : "Ctrl+2",
        click: () => goToRoute("/week"),
      },
      {
        label: "Priorities",
        accelerator: isMac ? "Cmd+3" : "Ctrl+3",
        click: () => goToRoute("/priorities"),
      },
      {
        label: "Lists",
        accelerator: isMac ? "Cmd+4" : "Ctrl+4",
        click: () => goToRoute("/lists"),
      },
      {
        label: "Goals",
        accelerator: isMac ? "Cmd+5" : "Ctrl+5",
        click: () => goToRoute("/goals"),
      },
      {
        label: "Settings",
        accelerator: isMac ? "Cmd+9" : "Ctrl+9",
        click: () => goToRoute("/settings"),
      },

      { type: "separator" },
      {
        label: "Toggle Quick Planner",
        accelerator: isMac ? "Cmd+B" : "Ctrl+B",
        click: () => toggleQuickPlanner(),
      },
    ],
  },
  { role: "windowMenu" },
  {
    role: "help",
    submenu: [
      {
        label: "Learn More",
        click: console.log,
      },
    ],
  },
];

const menu = Menu.buildFromTemplate(template);
Menu.setApplicationMenu(menu);
