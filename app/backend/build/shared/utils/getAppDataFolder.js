"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAppDataPath = getAppDataPath;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
function getAppDataPath() {
    const appDataPath = process.env.APPDATA ||
        (process.platform === "darwin"
            ? path_1.default.join(process.env.HOME, "Library", "Application Support")
            : path_1.default.join(process.env.HOME, ".local", "share"));
    const appFolder = path_1.default.join(appDataPath, "Miranda Manager");
    if (!fs_1.default.existsSync(appFolder)) {
        fs_1.default.mkdirSync(appFolder, { recursive: true });
    }
    return appFolder;
}
;
