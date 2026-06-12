import multer from "multer";
import {v4 as uuidv4} from "uuid"
import fs from "fs"

import uploadConfig from "@/config/upload";

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadConfig.tmpFolder)
  },
  filename: function (req, file, cb) {
    const extensionFile = file.originalname.split(".").pop()

    const newFileName = uuidv4()

    cb(null, `${newFileName}.${extensionFile}`)
  }
})

export const upload = multer({storage})
