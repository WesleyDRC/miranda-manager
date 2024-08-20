import { app, BrowserWindow } from "electron";
import { fileURLToPath } from "url";
import { exec } from "child_process"
import isDev from "electron-is-dev";
import path, { dirname } from "path";
import http from "http"

const __dirname = dirname(fileURLToPath(import.meta.url));

function createWindow() {
  const win = new BrowserWindow({
    width: 1024,
    height: 768,
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  win.maximize()

  win.loadURL(
    isDev ? 
    "http://localhost:3000" : 
    `file://${path.join(__dirname, "../build", "index.html")}`
  );

  if (isDev) {
    win.webContents.openDevTools();
  }
}

app.whenReady().then(() => {
  startBackend().then(() => {
    console.log("Server started successfully!")
    createWindow()
  }).catch((error) => {
    console.log("Error starting the server!")
    app.quit()
  })
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (BrowserWindow.getAllWindows().length === 0) {
    createWindow();
  }
});

function startBackend() {
  const dockerComposePath = path.join(__dirname, '../../backend');

  return new Promise((resolve, reject) => {
    exec(`cd ${dockerComposePath} && docker-compose up -d`, (error, stdout, stderr) => {
      if (error) {
        console.error(`Erro ao executar docker-compose: ${error}`);
        reject(error);
        return;
      }
      console.log(`stdout: ${stdout}`);
      console.error(`stderr: ${stderr}`);
      
      waitForBackend(5000, 10)
        .then(resolve)
        .catch(reject);
    });
  });
}


function waitForBackend(port, retries) {
  return new Promise((resolve, reject) => {
    const attemptConnection = (retryCount) => {
      const req = http.get(`http://localhost:${port}/health-check`, (res) => {
        if (res.statusCode === 200) {
          resolve();
        } else {
          if (retryCount > 0) {
            console.log(`Trying to connect to the backend... (${retries - retryCount + 1})`);
            setTimeout(() => attemptConnection(retryCount - 1), 10000);
          } else {
            reject(new Error("Unable to connect to the backend!"));
          }
        }
      });

      req.on("error", () => {
        if (retryCount > 0) {
          console.log(`Trying to connect to the backend... (${retries - retryCount + 1})`);
          setTimeout(() => attemptConnection(retryCount - 1), 2000);
        } else {
          reject(new Error("Unable to connect to the backend!"));
        }
      });
    };

    attemptConnection(retries);
  });
}