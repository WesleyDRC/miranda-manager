"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
const multer_1 = __importDefault(require("multer"));
const uuid_1 = require("uuid");
const fs_1 = __importDefault(require("fs"));
const getAppDataFolder_1 = require("../../../../../shared/utils/getAppDataFolder");
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        const tempDir = `${(0, getAppDataFolder_1.getAppDataPath)()}/rent/temp`;
        if (!fs_1.default.existsSync(tempDir)) {
            fs_1.default.mkdirSync(tempDir, { recursive: true });
        }
        cb(null, tempDir);
    },
    filename: function (req, file, cb) {
        const extensionFile = file.originalname.split(".").pop();
        const newFileName = (0, uuid_1.v4)();
        cb(null, `${newFileName}.${extensionFile}`);
    }
});
exports.upload = (0, multer_1.default)({ storage });
