"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.User = void 0;
const AppError_1 = require("../../../shared/errors/AppError");
const userValidations_1 = __importDefault(require("./userValidations"));
class User {
    constructor(email, password, confirmPassword) {
        this._email = email;
        this._password = password;
        this._confirmPassword = confirmPassword;
    }
    static create(email, password, confirmPassword) {
        const attentionPoint = (0, userValidations_1.default)(email, password, confirmPassword);
        if (attentionPoint) {
            throw new AppError_1.AppError(attentionPoint, 400);
        }
        return new User(email, password, confirmPassword);
    }
    get password() {
        return this._password;
    }
}
exports.User = User;
