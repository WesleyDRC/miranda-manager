import { Router } from "express";
import multer from "multer";

import uploadConfig from "../../../../config/upload";
import { UploadController } from "../controllers/UploadController";

import ensureAuthenticated from "../../../../modules/auth/infra/http/middlewares/ensureAuthenticated";

const uploadRoutes = Router();
const upload = multer(uploadConfig);

const uploadController = new UploadController();

uploadRoutes.post("/", ensureAuthenticated, upload.single("file"), uploadController.handle);

export default uploadRoutes;
