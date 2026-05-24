"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const ensureAuthenticated_1 = __importDefault(require("../../../../auth/infra/http/middlewares/ensureAuthenticated"));
const CreateCategoryController_1 = require("../controller/CreateCategoryController");
const GetCategoryController_1 = require("../controller/GetCategoryController");
const GetCategoryByIdController_1 = require("../controller/GetCategoryByIdController");
const categoryRoutes = (0, express_1.Router)();
const createCategoryController = new CreateCategoryController_1.CreateCategoryController();
const getCategoryController = new GetCategoryController_1.GetCategoryController();
const getCategoryByIdController = new GetCategoryByIdController_1.GetCategoryByIdController();
categoryRoutes.post("/", ensureAuthenticated_1.default, createCategoryController.handle);
categoryRoutes.get("/", ensureAuthenticated_1.default, getCategoryController.handle);
categoryRoutes.get("/:id", ensureAuthenticated_1.default, getCategoryByIdController.handle);
exports.default = categoryRoutes;
