import { Router } from "express";

import ensureAuthenticated from "../../../../auth/infra/http/middlewares/ensureAuthenticated";

import { CreateRentController } from "../controllers/CreateRentController";
import { GetRentByIdController } from "../controllers/GetRentByIdController";

const rentRoutes = Router()

const createRentController = new CreateRentController()
const getRentByIdController = new GetRentByIdController()

rentRoutes.post("/", ensureAuthenticated, createRentController.handle)
rentRoutes.get("/:id", ensureAuthenticated, getRentByIdController.handle)

export default rentRoutes