"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RentReceipt = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const uuid_1 = require("uuid");
const rentReceiptSchema = new mongoose_1.default.Schema({
    _id: {
        type: String,
        default: uuid_1.v4,
    },
    receipt: {
        type: String,
        required: false
    },
    rentMonthId: {
        type: String,
        ref: "RentMonth",
        required: true,
    },
});
exports.RentReceipt = mongoose_1.default.model("RentReceipt", rentReceiptSchema);
