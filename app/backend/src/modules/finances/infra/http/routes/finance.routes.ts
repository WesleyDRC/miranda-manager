import { Router } from "express";

import ensureAuthenticated from "@/modules/auth/infra/http/middlewares/ensureAuthenticated";

import { CreateFinanceController } from "@/modules/finances/infra/http/controllers/CreateFinanceController";
import { GetFinancesController } from "@/modules/finances/infra/http/controllers/GetFinancesController";
import { GetFinanceByIdController } from "@/modules/finances/infra/http/controllers/GetFinanceByIdController";

const financeRoutes = Router();
const createFinanceController = new CreateFinanceController();
const getFinancesController = new GetFinancesController();
const getFinanceByIdController = new GetFinanceByIdController();

financeRoutes.post("/", ensureAuthenticated, createFinanceController.handle);
financeRoutes.get("/", ensureAuthenticated, getFinancesController.handle);
financeRoutes.get("/:id", ensureAuthenticated, getFinanceByIdController.handle);

export default financeRoutes;
