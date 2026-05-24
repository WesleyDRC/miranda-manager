"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppError = void 0;
class AppError {
    constructor(message, statusCode = 400, metadata) {
        this.message = message;
        this.statusCode = statusCode;
        this.metadata = metadata;
    }
}
exports.AppError = AppError;
