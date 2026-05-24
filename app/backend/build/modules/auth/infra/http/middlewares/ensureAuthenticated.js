"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = require("jsonwebtoken");
const AppError_1 = require("../../../../../shared/errors/AppError");
const AuthRepository_1 = require("../../mongoose/repository/AuthRepository");
const tsyringe_1 = require("tsyringe");
const ensureAuthenticated = (request, response, next) => __awaiter(void 0, void 0, void 0, function* () {
    const authHeader = request.headers.authorization;
    if (!authHeader || !/^Bearer \S*$/.test(authHeader)) {
        throw new AppError_1.AppError("Token not found", 401);
    }
    const [, token] = authHeader.split(" ");
    if (token === "undefined") {
        throw new AppError_1.AppError("Token malformed", 401);
    }
    const authRepository = tsyringe_1.container.resolve(AuthRepository_1.AuthRepository);
    try {
        const user_id = (0, jsonwebtoken_1.verify)(token, process.env.APP_SECRET);
        const user = yield authRepository.findById(user_id);
        if (user.length === 0) {
            throw new AppError_1.AppError("User not found", 401);
        }
        request.user = {
            id: user_id,
        };
        next();
    }
    catch (error) {
        throw new AppError_1.AppError("Invalid token", 401);
    }
});
exports.default = ensureAuthenticated;
