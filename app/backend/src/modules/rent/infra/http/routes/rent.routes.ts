import { Router } from "express";

import ensureAuthenticated from "../../../../auth/infra/http/middlewares/ensureAuthenticated";

import { CreateRentController } from "../controllers/CreateRentController";

const rentRoutes = Router()

const createRentController = new CreateRentController()

rentRoutes.post("/", ensureAuthenticated, createRentController.handle)

export default rentRoutes