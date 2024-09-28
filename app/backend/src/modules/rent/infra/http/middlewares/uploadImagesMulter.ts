import multer from "multer";
import {v4 as uuidv4} from "uuid"
import fs from "fs"

import { getAppDataPath } from "../../../../../shared/utils/getAppDataFolder";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {

    const tempDir = `${getAppDataPath()}/rent/temp`;
    if (!fs.existsSync(tempDir)) {
      fs.mkdirSync(tempDir, { recursive: true });
    }

    cb(null, tempDir)
  },
  filename: function (req, file, cb) {
    const extensionFile = file.originalname.split(".").pop()

    const newFileName = uuidv4()

    cb(null, `${newFileName}.${extensionFile}`)
  }
})

export const upload = multer({storage})
