"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
require("dotenv/config");
require("../moongose/");
require("../../container/index");
require("express-async-errors");
const cors_1 = __importDefault(require("cors"));
const express_1 = __importDefault(require("express"));
const routes_1 = __importDefault(require("./routes/routes"));
const AppError_1 = require("../../errors/AppError");
// APP
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.json());
app.use(routes_1.default);
app.use((err, request, response, _) => {
    if (err instanceof AppError_1.AppError) {
        return response.status(err.statusCode).json({
            status: "error",
            message: err.message,
            metadata: err.metadata,
        });
    }
    // eslint-disable-next-line no-console
    console.error(err);
    return response.status(500).json({
        status: "error",
        message: "Internal server error",
    });
});
exports.default = app;
