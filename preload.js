const { ipcRenderer, contextBridge } = require("electron");

contextBridge.exposeInMainWorld(
    "electron", {
        saveTextFile: (filename, text) => {
            ipcRenderer.send("saveTextFile", filename, text);
        }
    }
);