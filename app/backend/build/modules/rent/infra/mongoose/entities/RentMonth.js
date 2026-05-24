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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.RentMonth = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const uuid_1 = require("uuid");
const Rent_1 = require("./Rent");
const RentExpense_1 = require("./RentExpense");
const rentMonthSchema = new mongoose_1.default.Schema({
    _id: {
        type: String,
        default: uuid_1.v4,
    },
    dateMonth: {
        type: Date,
        required: true,
    },
    amountPaid: {
        type: Number,
        default: 0,
        required: true,
    },
    paid: {
        type: Boolean,
        default: false,
        required: true,
    },
    receipts: [
        {
            type: String,
            ref: "RentReceipt",
        },
    ],
    rentId: {
        type: String,
        ref: "Rent",
        required: true,
    },
});
rentMonthSchema.post("save", function (doc) {
    return __awaiter(this, void 0, void 0, function* () {
        yield updateEarnings(doc.rentId);
    });
});
rentMonthSchema.post("findOneAndUpdate", function (doc) {
    return __awaiter(this, void 0, void 0, function* () {
        yield updateEarnings(doc.rentId);
    });
});
function updateEarnings(rentId) {
    return __awaiter(this, void 0, void 0, function* () {
        const rentMonths = yield exports.RentMonth.find({ rentId });
        const rentExpenses = yield Promise.all(rentMonths.map((month) => __awaiter(this, void 0, void 0, function* () {
            const expense = yield RentExpense_1.RentExpense.find({ rentMonthId: month._id });
            return expense;
        })));
        const totalGrossIncome = rentMonths.reduce((total, rentMonth) => {
            return total + (rentMonth.amountPaid || 0);
        }, 0);
        const totalExpenseAmount = rentExpenses[0].reduce((total, rentExpenseAmount) => total + rentExpenseAmount.amount, 0);
        const totalNetIncome = totalGrossIncome - totalExpenseAmount;
        yield Rent_1.Rent.updateOne({ _id: rentId }, { grossIncome: totalGrossIncome, netIncome: totalNetIncome });
    });
}
exports.RentMonth = mongoose_1.default.model("RentMonth", rentMonthSchema);
