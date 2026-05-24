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
exports.RentExpense = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const uuid_1 = require("uuid");
const Rent_1 = require("./Rent");
const RentMonth_1 = require("./RentMonth");
const rentExpenseSchema = new mongoose_1.default.Schema({
    _id: {
        type: String,
        default: uuid_1.v4,
    },
    amount: {
        type: Number,
        required: true,
    },
    reason: {
        type: String,
        required: true,
    },
    rentMonthId: {
        type: String,
        required: true,
        ref: "Rent",
    },
    userId: {
        type: String,
        require: true,
        ref: "User",
    },
});
rentExpenseSchema.post("save", function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield updateNetIncome(this.rentMonthId);
    });
});
rentExpenseSchema.post("findOneAndUpdate", function (doc) {
    return __awaiter(this, void 0, void 0, function* () {
        yield updateNetIncome(doc.rentMonthId);
    });
});
rentExpenseSchema.post("findOneAndDelete", function (doc) {
    return __awaiter(this, void 0, void 0, function* () {
        yield updateNetIncome(doc.rentMonthId);
    });
});
function updateNetIncome(rentMonthId) {
    return __awaiter(this, void 0, void 0, function* () {
        const rentId = (yield RentMonth_1.RentMonth.findById(rentMonthId)).rentId;
        const rentMonths = yield RentMonth_1.RentMonth.find({ rentId: rentId }).where({
            paid: true,
        });
        const rentExpenses = yield exports.RentExpense.find({ rentMonthId });
        const totalGrossIncome = rentMonths.reduce((total, rentMonth) => total + rentMonth.amountPaid, 0);
        const totalExpenseAmount = rentExpenses.reduce((total, rentExpenseAmount) => total + rentExpenseAmount.amount, 0);
        const totalNetIncome = totalGrossIncome - totalExpenseAmount;
        yield Rent_1.Rent.updateOne({ _id: rentId }, { netIncome: totalNetIncome });
    });
}
exports.RentExpense = mongoose_1.default.model("RentExpense", rentExpenseSchema);
