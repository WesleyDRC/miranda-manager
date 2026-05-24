"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
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
exports.GetRentByIdUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const rentConstants_1 = require("../contants/rentConstants");
const formatDateToDDMMYY_1 = require("../../../shared/utils/formatDateToDDMMYY");
const AppError_1 = require("../../../shared/errors/AppError");
let GetRentByIdUseCase = class GetRentByIdUseCase {
    constructor(rentRepository) {
        this.rentRepository = rentRepository;
    }
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ id, userId }) {
            const rent = yield this.rentRepository.findById({ id, userId });
            if (!rent) {
                throw new AppError_1.AppError(rentConstants_1.rentConstants.NOT_FOUND, 404);
            }
            const rentMonths = yield this.rentRepository.findAllRentMonthByRentId(id);
            const rentValue = parseFloat(rent.value) || 0;
            let totalPaid = 0;
            const months = yield Promise.all(rentMonths.map((month) => __awaiter(this, void 0, void 0, function* () {
                const rentExpenses = yield this.rentRepository.findRentExpenses(month.id);
                const rentReceipts = yield this.rentRepository.findRentReceipts(month.id);
                const rentPayments = yield this.rentRepository.findRentPayments(month.id);
                totalPaid += month.amountPaid || 0;
                return {
                    id: month.id,
                    dateMonth: (0, formatDateToDDMMYY_1.formatDateToDDMMYY)(month.dateMonth),
                    amountPaid: month.amountPaid,
                    paid: month.paid,
                    difference: rentValue - (month.amountPaid || 0),
                    receipt: rentReceipts,
                    expenses: rentExpenses,
                    payments: rentPayments,
                };
            })));
            const totalExpected = months.length * rentValue;
            const totalDebt = totalExpected - totalPaid;
            const isDebtFree = totalDebt <= 0;
            rent.months = months;
            rent.totalExpected = totalExpected;
            rent.totalPaid = totalPaid;
            rent.totalDebt = totalDebt;
            rent.isDebtFree = isDebtFree;
            return rent;
        });
    }
};
exports.GetRentByIdUseCase = GetRentByIdUseCase;
exports.GetRentByIdUseCase = GetRentByIdUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("RentRepository")),
    __metadata("design:paramtypes", [Object])
], GetRentByIdUseCase);
