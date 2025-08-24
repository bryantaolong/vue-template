import { app, BrowserWindow } from "electron";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function createWindow() {
    const win = new BrowserWindow({
        width: 1000,
        height: 800,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
        },
    });

    if (process.env.VITE_DEV_SERVER_URL) {
        // 开发模式：加载 Vite 启动的前端服务器
        win.loadURL(process.env.VITE_DEV_SERVER_URL);
    } else {
        // 生产模式：加载打包后的 index.html
        win.loadFile(path.join(__dirname, "../dist/index.html"));
    }
}

app.whenReady().then(() => {
    createWindow();

    app.on("activate", () => {
        if (BrowserWindow.getAllWindows().length === 0) createWindow();
    });
});

app.on("window-all-closed", () => {
    if (process.platform !== "darwin") app.quit();
});
