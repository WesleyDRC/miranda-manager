import { Router } from "express";

import ensureAuthenticated from "../../../../auth/infra/http/middlewares/ensureAuthenticated";

import { CreateRentController } from "../controllers/CreateRentController";
import { GetRentByIdController } from "../controllers/GetRentByIdController";
import { CreateRentExpenseController } from "../controllers/CreateRentExpenseController";
import { UpdateRentMonthController } from "../controllers/UpdateRentMonthController";

const rentRoutes = Router()

const createRentController = new CreateRentController()
const getRentByIdController = new GetRentByIdController()
const createRentExpenseController = new CreateRentExpenseController()
const updateRentMonthController = new UpdateRentMonthController()

rentRoutes.post("/", ensureAuthenticated, createRentController.handle)
rentRoutes.get("/:id", ensureAuthenticated, getRentByIdController.handle)
rentRoutes.post("/expense", ensureAuthenticated, createRentExpenseController.handle)
rentRoutes.patch("/:rentId/month/:rentMonthid", ensureAuthenticated, updateRentMonthController.handle)

export default rentRoutes