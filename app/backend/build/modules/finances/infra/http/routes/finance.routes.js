"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ensureAuthenticated_1 = __importDefault(require("../../../../auth/infra/http/middlewares/ensureAuthenticated"));
const CreateFinanceController_1 = require("../controllers/CreateFinanceController");
const GetFinancesController_1 = require("../controllers/GetFinancesController");
const GetFinanceByIdController_1 = require("../controllers/GetFinanceByIdController");
const financeRoutes = (0, express_1.Router)();
const createFinanceController = new CreateFinanceController_1.CreateFinanceController();
const getFinancesController = new GetFinancesController_1.GetFinancesController();
const getFinanceByIdController = new GetFinanceByIdController_1.GetFinanceByIdController();
financeRoutes.post("/", ensureAuthenticated_1.default, createFinanceController.handle);
financeRoutes.get("/", ensureAuthenticated_1.default, getFinancesController.handle);
financeRoutes.get("/:id", ensureAuthenticated_1.default, getFinanceByIdController.handle);
exports.default = financeRoutes;
