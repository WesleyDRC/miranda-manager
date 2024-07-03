import { Router } from "express";

import ensureAuthenticated from "../../../../auth/infra/http/middlewares/ensureAuthenticated";

import { CreateFinanceController } from "../controllers/CreateFinanceController";

const financeRoutes = Router();
const createFinanceController = new CreateFinanceController();

financeRoutes.post("/", ensureAuthenticated, createFinanceController.handle);

export default financeRoutes;
