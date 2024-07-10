import { Router } from "express";

import ensureAuthenticated from "../../../../auth/infra/http/middlewares/ensureAuthenticated";

import { CreateFinanceController } from "../controllers/CreateFinanceController";
import { GetFinancesController } from "../controllers/GetFinancesController";

const financeRoutes = Router();
const createFinanceController = new CreateFinanceController();
const getFinancesController = new GetFinancesController();

financeRoutes.post("/", ensureAuthenticated, createFinanceController.handle);
financeRoutes.get("/", ensureAuthenticated, getFinancesController.handle);

export default financeRoutes;
