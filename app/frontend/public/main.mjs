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
    ico: path.join(__dirname, "logo.ico"),
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

function backendStarted(port) {
  return new Promise((resolve, reject) => {
    http.get(`http://localhost:${port}/health-check`, (res) => {
      resolve(res.statusCode === 200);
    }).on('error', (err) => {
      console.log(`Erro ao tentar conectar ao backend: ${err.message}`);
      reject(false);
    });
  });
}

function startBackend() {
  const dockerComposePath = path.join(__dirname, '../../backend');

  return new Promise((resolve, reject) => {
    backendStarted(5000)
    .then((started) => {
      if(started) {
        console.log("The backend has already started!")
        resolve()
        return;
      }

      exec(`cd ${dockerComposePath} && docker-compose up -d`, (error, stdout, stderr) => {
        if (error) {
          console.error(`Error when running docker-compose: ${error}`);
          reject(error);
          return;
        }
        
        waitForBackend(5000, 10)
          .then(resolve)
          .reject(reject)
      });
    }).catch((error) => {
      console.log(error)
    })
  })
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