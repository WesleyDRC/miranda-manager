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
exports.RentPayment = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const uuid_1 = require("uuid");
const RentMonth_1 = require("./RentMonth");
const Rent_1 = require("./Rent");
const rentPaymentSchema = new mongoose_1.default.Schema({
    _id: {
        type: String,
        default: uuid_1.v4,
    },
    amount: {
        type: Number,
        required: true,
    },
    paymentDate: {
        type: Date,
        required: true,
    },
    rentMonthId: {
        type: String,
        required: true,
        ref: "RentMonth",
    },
    userId: {
        type: String,
        require: true,
        ref: "User",
    },
});
rentPaymentSchema.post("save", function () {
    return __awaiter(this, void 0, void 0, function* () {
        yield updateRentMonthAmountPaid(this.rentMonthId);
    });
});
rentPaymentSchema.post("findOneAndUpdate", function (doc) {
    return __awaiter(this, void 0, void 0, function* () {
        if (doc) {
            yield updateRentMonthAmountPaid(doc.rentMonthId);
        }
    });
});
rentPaymentSchema.post("findOneAndDelete", function (doc) {
    return __awaiter(this, void 0, void 0, function* () {
        if (doc) {
            yield updateRentMonthAmountPaid(doc.rentMonthId);
        }
    });
});
function updateRentMonthAmountPaid(rentMonthId) {
    return __awaiter(this, void 0, void 0, function* () {
        const rentPayments = yield exports.RentPayment.find({ rentMonthId });
        const totalAmountPaid = rentPayments.reduce((total, payment) => total + payment.amount, 0);
        const rentMonth = yield RentMonth_1.RentMonth.findById(rentMonthId);
        if (!rentMonth)
            return;
        const rent = yield Rent_1.Rent.findById(rentMonth.rentId);
        if (!rent)
            return;
        const rentValue = parseFloat(rent.value) || 0;
        const isPaid = totalAmountPaid >= rentValue;
        rentMonth.amountPaid = totalAmountPaid;
        rentMonth.paid = isPaid;
        yield rentMonth.save();
    });
}
exports.RentPayment = mongoose_1.default.model("RentPayment", rentPaymentSchema);
