"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.saveImage = saveImage;
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
function saveImage(pathToSave, imageBuffer, imageName) {
    const imagePath = path_1.default.join(pathToSave, imageName);
    fs_1.default.writeFileSync(imagePath, imageBuffer);
    return imagePath;
}
