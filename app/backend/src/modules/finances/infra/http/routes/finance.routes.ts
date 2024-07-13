import { Router } from "express";

import ensureAuthenticated from "../../../../auth/infra/http/middlewares/ensureAuthenticated";

import { CreateFinanceController } from "../controllers/CreateFinanceController";
import { GetFinancesController } from "../controllers/GetFinancesController";
import { GetFinanceByIdController } from "../controllers/GetFinanceByIdController";

const financeRoutes = Router();
const createFinanceController = new CreateFinanceController();
const getFinancesController = new GetFinancesController();
const getFinanceByIdController = new GetFinanceByIdController();

financeRoutes.post("/", ensureAuthenticated, createFinanceController.handle);
financeRoutes.get("/", ensureAuthenticated, getFinancesController.handle);
financeRoutes.get("/:id", ensureAuthenticated, getFinanceByIdController.handle);

export default financeRoutes;
