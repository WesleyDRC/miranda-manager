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
exports.FinanceRepository = void 0;
const Finance_1 = require("../entities/Finance");
class FinanceRepository {
    create(_a) {
        return __awaiter(this, arguments, void 0, function* ({ name, categoryId, rentId, userId }) {
            const financeCreated = yield Finance_1.Finance.create({
                name,
                categoryId,
                rentId,
                userId
            });
            const finance = {
                id: financeCreated._id,
                name: financeCreated.name,
                categoryId: financeCreated.categoryId.id,
                rentId: financeCreated.rentId.id,
                userId: financeCreated.userId
            };
            return finance;
        });
    }
    findByName(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const financeFound = yield Finance_1.Finance.findOne({
                name
            });
            if (!financeFound) {
                return null;
            }
            const finance = {
                id: financeFound._id,
                name: financeFound.name,
                categoryId: financeFound.categoryId.id,
                rentId: financeFound.rentId.id,
                userId: financeFound.userId
            };
            return finance;
        });
    }
    findAll(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const financesFound = yield Finance_1.Finance.find({ userId }).populate("rentId").populate("categoryId");
            let finances = [];
            financesFound.forEach((financeFound) => {
                finances.push({
                    id: financeFound._id,
                    name: financeFound.name,
                    category: {
                        id: financeFound.categoryId.id,
                        name: financeFound.categoryId.name
                    },
                    rent: {
                        id: financeFound.rentId.id,
                        tenant: financeFound.rentId.tenant,
                        value: financeFound.rentId.value,
                        street: financeFound.rentId.street,
                        streetNumber: financeFound.rentId.streetNumber,
                        startRental: financeFound.rentId.startRental,
                        grossIncome: financeFound.rentId.grossIncome,
                        netIncome: financeFound.rentId.netIncome,
                        userId: financeFound.rentId.userId
                    },
                    userId: financeFound.userId
                });
            });
            return finances;
        });
    }
    findById(id, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const financeFound = yield Finance_1.Finance.findOne({
                _id: id,
                userId
            }).populate("rentId").populate("categoryId");
            if (!financeFound) {
                return null;
            }
            const finance = {
                id: financeFound._id,
                name: financeFound.name,
                category: {
                    id: financeFound.categoryId.id,
                    name: financeFound.categoryId.name
                },
                rent: {
                    id: financeFound.rentId.id,
                    tenant: financeFound.rentId.tenant,
                    value: financeFound.rentId.value,
                    street: financeFound.rentId.street,
                    streetNumber: financeFound.rentId.streetNumber,
                    startRental: financeFound.rentId.startRental,
                    grossIncome: financeFound.rentId.grossIncome,
                    netIncome: financeFound.rentId.netIncome,
                    userId: financeFound.rentId.userId
                },
                userId: financeFound.userId
            };
            return finance;
        });
    }
}
exports.FinanceRepository = FinanceRepository;
