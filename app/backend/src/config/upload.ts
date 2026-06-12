import multer from "multer";
import crypto from "crypto";
import path from "path";
import fs from "fs";

const tmpFolder = path.resolve(__dirname, "..", "..", "tmp", "uploads");
const uploadsFolder = path.resolve(__dirname, "..", "..", "uploads");

if (!fs.existsSync(tmpFolder)) {
  fs.mkdirSync(tmpFolder, { recursive: true });
}

if (!fs.existsSync(uploadsFolder)) {
  fs.mkdirSync(uploadsFolder, { recursive: true });
}

export default {
  tmpFolder,
  uploadsFolder,
  directory: tmpFolder,
  storage: multer.diskStorage({
    destination: tmpFolder,
    filename(request, file, callback) {
      const fileHash = crypto.randomBytes(16).toString("hex");
      const fileName = `${fileHash}-${file.originalname}`;

      return callback(null, fileName);
    },
  }),
};
