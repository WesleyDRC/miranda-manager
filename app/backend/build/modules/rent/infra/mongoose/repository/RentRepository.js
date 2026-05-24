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
exports.RentRepository = void 0;
const Rent_1 = require("../entities/Rent");
const RentExpense_1 = require("../entities/RentExpense");
const RentMonth_1 = require("../entities/RentMonth");
const RentReceipts_1 = require("../entities/RentReceipts");
const RentPayment_1 = require("../entities/RentPayment");
class RentRepository {
    create(rent) {
        return __awaiter(this, void 0, void 0, function* () {
            const rentalCreated = yield Rent_1.Rent.create({
                tenant: rent.tenant,
                value: rent.value,
                street: rent.street,
                streetNumber: rent.streetNumber,
                startRental: rent.startRental,
                userId: rent.userId,
            });
            const rental = {
                id: rentalCreated._id,
                tenant: rentalCreated.tenant,
                value: rentalCreated.value,
                street: rentalCreated.street,
                streetNumber: rentalCreated.streetNumber,
                startRental: rentalCreated.startRental,
                grossIncome: rentalCreated.grossIncome,
                netIncome: rentalCreated.netIncome,
                userId: rentalCreated.userId,
            };
            return rental;
        });
    }
    createRentMonth(rentMonth) {
        return __awaiter(this, void 0, void 0, function* () {
            const rentMonthCreated = yield RentMonth_1.RentMonth.create({
                dateMonth: rentMonth.dateMonth,
                amountPaid: rentMonth.amountPaid,
                paid: rentMonth.paid,
                rentId: rentMonth.rentId,
            });
            const rent = {
                id: rentMonthCreated._id,
                dateMonth: rentMonthCreated.dateMonth,
                amountPaid: rentMonthCreated.amountPaid,
                paid: rentMonthCreated.paid,
                rentId: rentMonthCreated.rentId,
            };
            return rent;
        });
    }
    findById(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id, userId }) {
            const rentFound = yield Rent_1.Rent.findOne({
                _id: id,
                userId,
            });
            if (!rentFound) {
                return null;
            }
            const rent = {
                id: rentFound._id,
                tenant: rentFound.tenant,
                value: rentFound.value,
                street: rentFound.street,
                streetNumber: rentFound.streetNumber,
                startRental: rentFound.startRental,
                grossIncome: rentFound.grossIncome,
                netIncome: rentFound.netIncome,
                userId: rentFound.userId,
            };
            return rent;
        });
    }
    findRentMonthById(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id }) {
            const rentMonthFound = yield RentMonth_1.RentMonth.findOne({
                _id: id,
            });
            if (!rentMonthFound) {
                return null;
            }
            const rentMonth = {
                id: rentMonthFound._id,
                dateMonth: rentMonthFound.dateMonth,
                amountPaid: rentMonthFound.amountPaid,
                paid: rentMonthFound.paid,
                rentId: rentMonthFound.rentId,
            };
            return rentMonth;
        });
    }
    findAllRentMonthByRentId(rentId) {
        return __awaiter(this, void 0, void 0, function* () {
            const rentMonthFound = yield RentMonth_1.RentMonth.find({ rentId });
            const rentMonths = rentMonthFound.map((rentMonth) => {
                return {
                    id: rentMonth._id,
                    dateMonth: rentMonth.dateMonth,
                    amountPaid: rentMonth.amountPaid,
                    paid: rentMonth.paid,
                    rentId: rentMonth.rentId,
                };
            });
            return rentMonths;
        });
    }
    updateRent(id, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedRent = yield Rent_1.Rent.findByIdAndUpdate(id, updates, {
                new: true,
                runValidators: true,
            });
            return updatedRent;
        });
    }
    updateRentMonth(rentMonthId, rentId, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedRentMonth = yield RentMonth_1.RentMonth.findOneAndUpdate({ _id: rentMonthId, rentId }, updates, { new: true, runValidators: true });
            const rentMonth = {
                id: updatedRentMonth._id,
                dateMonth: updatedRentMonth.dateMonth,
                amountPaid: updatedRentMonth.amountPaid,
                paid: updatedRentMonth.paid,
                rentId: updatedRentMonth.rentId,
            };
            return rentMonth;
        });
    }
    createRentExpense(rentExpense) {
        return __awaiter(this, void 0, void 0, function* () {
            const rentExpenseCreated = yield RentExpense_1.RentExpense.create({
                amount: rentExpense.amount,
                reason: rentExpense.reason,
                rentMonthId: rentExpense.rentMonthId,
                userId: rentExpense.userId,
            });
            const rent = {
                id: rentExpenseCreated._id,
                amount: rentExpenseCreated.amount,
                reason: rentExpenseCreated.reason,
                rentMonthId: rentExpenseCreated.rentMonthId,
                userId: rentExpense.userId,
            };
            return rent;
        });
    }
    findRentExpenses(rentMonthId) {
        return __awaiter(this, void 0, void 0, function* () {
            const rentExpenseFound = yield RentExpense_1.RentExpense.find({ rentMonthId });
            const rentExpenses = rentExpenseFound.map((rentExpense) => {
                return {
                    id: rentExpense._id,
                    amount: rentExpense.amount,
                    reason: rentExpense.reason,
                    rentMonthId: rentExpense.rentMonthId,
                    userId: rentExpense.userId,
                };
            });
            return rentExpenses;
        });
    }
    findRentExpenseById(rentExpenseId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const rentExpense = yield RentExpense_1.RentExpense.findOne({
                _id: rentExpenseId,
                userId,
            });
            if (!rentExpense) {
                return null;
            }
            return {
                id: rentExpense._id,
                amount: rentExpense.amount,
                reason: rentExpense.reason,
                rentMonthId: rentExpense.rentMonthId,
                userId: rentExpense.userId,
            };
        });
    }
    updateRentExpense(rentExpenseId, userId, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedRentExpense = yield RentExpense_1.RentExpense.findOneAndUpdate({ _id: rentExpenseId, userId }, updates, { new: true, runValidators: true });
            return {
                id: updatedRentExpense._id,
                amount: updatedRentExpense.amount,
                reason: updatedRentExpense.reason,
                rentMonthId: updatedRentExpense.rentMonthId,
                userId: updatedRentExpense.userId,
            };
        });
    }
    deleteRentExpense(rentExpenseId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const wasDeleted = yield RentExpense_1.RentExpense.findOneAndDelete({
                _id: rentExpenseId,
                userId,
            });
            return wasDeleted ? true : false;
        });
    }
    createRentReceipt(rentReceipt) {
        return __awaiter(this, void 0, void 0, function* () {
            const receiptCreated = yield RentReceipts_1.RentReceipt.create({
                receipt: rentReceipt.receipt,
                rentMonthId: rentReceipt.rentMonthId
            });
            const receipt = {
                id: receiptCreated._id,
                receipt: receiptCreated.receipt,
                rentMonthId: receiptCreated.rentMonthId
            };
            return receipt;
        });
    }
    findRentReceipts(rentMonthId) {
        return __awaiter(this, void 0, void 0, function* () {
            const rentReceiptsFound = yield RentReceipts_1.RentReceipt.find({ rentMonthId });
            const rentReceipts = rentReceiptsFound.map((rentReceipt) => {
                return {
                    id: rentReceipt._id,
                    receipt: rentReceipt.receipt,
                    rentMonthId: rentReceipt.rentMonthId
                };
            });
            return rentReceipts;
        });
    }
    createRentPayment(rentPayment) {
        return __awaiter(this, void 0, void 0, function* () {
            const rentPaymentCreated = yield RentPayment_1.RentPayment.create({
                amount: rentPayment.amount,
                paymentDate: rentPayment.paymentDate,
                rentMonthId: rentPayment.rentMonthId,
                userId: rentPayment.userId,
            });
            return {
                id: rentPaymentCreated._id,
                amount: rentPaymentCreated.amount,
                paymentDate: rentPaymentCreated.paymentDate,
                rentMonthId: rentPaymentCreated.rentMonthId,
                userId: rentPaymentCreated.userId,
            };
        });
    }
    findRentPayments(rentMonthId) {
        return __awaiter(this, void 0, void 0, function* () {
            const paymentsFound = yield RentPayment_1.RentPayment.find({ rentMonthId });
            return paymentsFound.map((payment) => ({
                id: payment._id,
                amount: payment.amount,
                paymentDate: payment.paymentDate,
                rentMonthId: payment.rentMonthId,
                userId: payment.userId,
            }));
        });
    }
    deleteRentPayment(rentPaymentId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const wasDeleted = yield RentPayment_1.RentPayment.findOneAndDelete({
                _id: rentPaymentId,
                userId,
            });
            return wasDeleted ? true : false;
        });
    }
    findAll(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const rentsFound = yield Rent_1.Rent.find({ userId });
            return rentsFound.map((rentFound) => ({
                id: rentFound._id,
                tenant: rentFound.tenant,
                value: rentFound.value,
                street: rentFound.street,
                streetNumber: rentFound.streetNumber,
                startRental: rentFound.startRental,
                grossIncome: rentFound.grossIncome,
                netIncome: rentFound.netIncome,
                userId: rentFound.userId,
                observations: rentFound.observations,
            }));
        });
    }
    update(id, userId, updates) {
        return __awaiter(this, void 0, void 0, function* () {
            const updatedRent = yield Rent_1.Rent.findOneAndUpdate({ _id: id, userId }, updates, { new: true, runValidators: true });
            if (!updatedRent) {
                return null;
            }
            return {
                id: updatedRent._id,
                tenant: updatedRent.tenant,
                value: updatedRent.value,
                street: updatedRent.street,
                streetNumber: updatedRent.streetNumber,
                startRental: updatedRent.startRental,
                grossIncome: updatedRent.grossIncome,
                netIncome: updatedRent.netIncome,
                userId: updatedRent.userId,
                observations: updatedRent.observations,
            };
        });
    }
    findRentPaymentsByMonthIds(monthIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const paymentsFound = yield RentPayment_1.RentPayment.find({ rentMonthId: { $in: monthIds } });
            return paymentsFound.map((payment) => ({
                id: payment._id,
                amount: payment.amount,
                paymentDate: payment.paymentDate,
                rentMonthId: payment.rentMonthId,
                userId: payment.userId,
            }));
        });
    }
    findRentExpensesByMonthIds(monthIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const expensesFound = yield RentExpense_1.RentExpense.find({ rentMonthId: { $in: monthIds } });
            return expensesFound.map((expense) => ({
                id: expense._id,
                amount: expense.amount,
                reason: expense.reason,
                rentMonthId: expense.rentMonthId,
                userId: expense.userId,
            }));
        });
    }
    findRentReceiptsByMonthIds(monthIds) {
        return __awaiter(this, void 0, void 0, function* () {
            const receiptsFound = yield RentReceipts_1.RentReceipt.find({ rentMonthId: { $in: monthIds } });
            return receiptsFound.map((receipt) => ({
                id: receipt._id,
                receipt: receipt.receipt,
                rentMonthId: receipt.rentMonthId,
            }));
        });
    }
}
exports.RentRepository = RentRepository;
