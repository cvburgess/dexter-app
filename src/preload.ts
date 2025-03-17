import { contextBridge, ipcRenderer } from "electron";

contextBridge.exposeInMainWorld("shell", {
  open: () => ipcRenderer.send("shell:open"),
});

// See the Electron documentation for details on how to use preload scripts:
// https://www.electronjs.org/docs/latest/tutorial/process-model#preload-scripts
