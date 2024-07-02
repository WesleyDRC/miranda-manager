import { Router } from "express";

import ensureAuthenticated from "../../../../auth/infra/http/middlewares/ensureAuthenticated";

import { CreateCategoryController } from "../controller/CreateCategoryController";

const categoryRoutes = Router()

const createCategoryController = new CreateCategoryController()

categoryRoutes.post("/", ensureAuthenticated, createCategoryController.handle)

export default categoryRoutes