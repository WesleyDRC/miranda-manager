"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Rent = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const uuid_1 = require("uuid");
const rentSchema = new mongoose_1.default.Schema({
    _id: {
        type: String,
        default: uuid_1.v4
    },
    tenant: {
        type: String,
        required: true
    },
    value: {
        type: String,
        required: true
    },
    street: {
        type: String,
        required: true
    },
    streetNumber: {
        type: String,
        required: true
    },
    startRental: {
        type: String,
        required: true
    },
    grossIncome: {
        type: Number,
        default: 0
    },
    netIncome: {
        type: Number,
        default: 0
    },
    userId: {
        type: String,
        required: true,
        ref: "User"
    },
    observations: {
        type: String,
        default: ""
    }
});
exports.Rent = mongoose_1.default.model("Rent", rentSchema);
