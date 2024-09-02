import path from "path";
import fs from "fs";

export function getAppDataPath() {
  const appDataPath =
    process.env.APPDATA ||
    (process.platform === "darwin"
      ? path.join(process.env.HOME, "Library", "Application Support")
      : path.join(process.env.HOME, ".local", "share"));

  const appFolder = path.join(appDataPath, "Miranda Manager");

  if (!fs.existsSync(appFolder)) {
    fs.mkdirSync(appFolder, { recursive: true });
  }

  return appFolder;
};
