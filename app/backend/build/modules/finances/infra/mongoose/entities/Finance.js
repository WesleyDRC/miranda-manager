"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Finance = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const uuid_1 = require("uuid");
const financeSchema = new mongoose_1.default.Schema({
    _id: {
        type: String,
        default: uuid_1.v4
    },
    name: {
        type: String,
        required: true,
        unique: true
    },
    categoryId: {
        type: String,
        required: true,
        ref: "Category"
    },
    rentId: {
        type: String,
        ref: "Rent"
    },
    userId: {
        type: String,
        required: true,
        ref: "User"
    }
});
exports.Finance = mongoose_1.default.model("Finance", financeSchema);
