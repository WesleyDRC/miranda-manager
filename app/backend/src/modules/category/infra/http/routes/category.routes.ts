import { Router } from "express";

import ensureAuthenticated from "../../../../auth/infra/http/middlewares/ensureAuthenticated";

import { CreateCategoryController } from "../controller/CreateCategoryController";
import { GetCategoryController } from "../controller/GetCategoryController";
import { GetCategoryByIdController } from "../controller/GetCategoryByIdController";

const categoryRoutes = Router()

const createCategoryController = new CreateCategoryController()
const getCategoryController = new GetCategoryController()
const getCategoryByIdController = new GetCategoryByIdController()

categoryRoutes.post("/", ensureAuthenticated, createCategoryController.handle)
categoryRoutes.get("/", ensureAuthenticated, getCategoryController.handle)
categoryRoutes.get("/:id", ensureAuthenticated, getCategoryByIdController.handle)

export default categoryRoutes