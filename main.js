const fs = require("fs").promises;
const path = require("path");
const process = require("process");

const { app, BrowserWindow, ipcMain } = require("electron");

const staticFilesDirectory = "docs"; // Must be "docs" due to GitHub Pages

function createWindow () {
    const window = new BrowserWindow({
        width: 800,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js")
        }
    });

    window.loadFile(path.join(__dirname, staticFilesDirectory, "index.html"));
}

app.whenReady().then(() => createWindow());

ipcMain.on("saveTextFile", async (event, filename, text) => {
    const strokesDirectory = "STROKES_DIRECTORY" in process.env
        ? process.env.STROKES_DIRECTORY
        : path.join(app.getPath("exe"), "strokes");
    fs.mkdir(strokesDirectory, { recursive: true });
    const filePath = path.join(strokesDirectory, filename);
    await fs.writeFile(filePath, text);
});