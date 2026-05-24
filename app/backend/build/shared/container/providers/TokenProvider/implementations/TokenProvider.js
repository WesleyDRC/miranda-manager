"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.JwTProvider = void 0;
const jsonwebtoken_1 = require("jsonwebtoken");
class JwTProvider {
    constructor() {
        this.secret = process.env.APP_SECRET;
    }
    generateToken(userId) {
        return (0, jsonwebtoken_1.sign)(userId, this.secret);
    }
}
exports.JwTProvider = JwTProvider;
