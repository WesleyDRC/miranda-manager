import { Router } from "express";

import ensureAuthenticated from "@/modules/auth/infra/http/middlewares/ensureAuthenticated";

import { CreateCategoryController } from "@/modules/category/infra/http/controller/CreateCategoryController";
import { GetCategoryController } from "@/modules/category/infra/http/controller/GetCategoryController";
import { GetCategoryByIdController } from "@/modules/category/infra/http/controller/GetCategoryByIdController";

const categoryRoutes = Router()

const createCategoryController = new CreateCategoryController()
const getCategoryController = new GetCategoryController()
const getCategoryByIdController = new GetCategoryByIdController()

categoryRoutes.post("/", ensureAuthenticated, createCategoryController.handle)
categoryRoutes.get("/", ensureAuthenticated, getCategoryController.handle)
categoryRoutes.get("/:id", ensureAuthenticated, getCategoryByIdController.handle)

export default categoryRoutes