import { Router } from "express";

import ensureAuthenticated from "../../../../auth/infra/http/middlewares/ensureAuthenticated";

import { CreateCategoryController } from "../controller/CreateCategoryController";
import { GetCategoryController } from "../controller/GetCategoryController";

const categoryRoutes = Router()

const createCategoryController = new CreateCategoryController()
const getCategoryController = new GetCategoryController()

categoryRoutes.post("/", ensureAuthenticated, createCategoryController.handle)
categoryRoutes.get("/", ensureAuthenticated, getCategoryController.handle)

export default categoryRoutes