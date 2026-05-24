"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_routes_1 = __importDefault(require("../../../../modules/auth/infra/http/routes/auth.routes"));
const category_routes_1 = __importDefault(require("../../../../modules/category/infra/http/routes/category.routes"));
const finance_routes_1 = __importDefault(require("../../../../modules/finances/infra/http/routes/finance.routes"));
const rent_routes_1 = __importDefault(require("../../../../modules/rent/infra/http/routes/rent.routes"));
const routes = (0, express_1.Router)();
routes.get("/health-check", (request, response) => {
    response.json({ message: "Ok" });
});
routes.use("/auth", auth_routes_1.default);
routes.use("/category", category_routes_1.default);
routes.use("/finance", finance_routes_1.default);
routes.use("/rent", rent_routes_1.default);
exports.default = routes;
