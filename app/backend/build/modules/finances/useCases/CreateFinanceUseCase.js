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
exports.CreateFinanceUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const financeContants_1 = require("../contants/financeContants");
const categoryContants_1 = require("../../category/contants/categoryContants");
const AppError_1 = require("../../../shared/errors/AppError");
let CreateFinanceUseCase = class CreateFinanceUseCase {
    constructor(financeRepository, categoryRepository, rentRepository) {
        this.financeRepository = financeRepository;
        this.categoryRepository = categoryRepository;
        this.rentRepository = rentRepository;
    }
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ name, rent, category, userId, }) {
            yield this.ensureFinanceDoesNotExist(name);
            const categoryFound = yield this.getCategory(category);
            const rentCreated = yield this.createRentIfNeeded(categoryFound.name, rent, userId);
            const rentMonths = yield this.createRentMonthIfNeeded(categoryFound.name, rent.startRental, rentCreated.id);
            rentCreated.months = rentMonths;
            const financeCreated = yield this.financeRepository.create({
                name,
                categoryId: categoryFound.id,
                rentId: rentCreated.id,
                userId,
            });
            const finance = {
                id: financeCreated.id,
                name: financeCreated.name,
                category: categoryFound,
                rent: rentCreated,
                userId: financeCreated.userId,
            };
            return finance;
        });
    }
    getCategory(categoryName) {
        return __awaiter(this, void 0, void 0, function* () {
            const category = yield this.categoryRepository.findByName(categoryName);
            if (!category) {
                throw new AppError_1.AppError(categoryContants_1.categoryConstants.NOT_FOUND, 404);
            }
            return category;
        });
    }
    ensureFinanceDoesNotExist(name) {
        return __awaiter(this, void 0, void 0, function* () {
            const financeFound = yield this.financeRepository.findByName(name);
            if (financeFound) {
                throw new AppError_1.AppError(financeContants_1.financeConstants.ALREADY_EXISTS, 409);
            }
        });
    }
    createRentIfNeeded(categoryName, rent, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (categoryName !== "Aluguel") {
                return null;
            }
            const rentCreated = yield this.rentRepository.create({
                tenant: rent.tenant,
                value: rent.value,
                street: rent.street,
                streetNumber: rent.streetNumber,
                startRental: rent.startRental,
                userId: userId,
            });
            return rentCreated;
        });
    }
    createRentMonthIfNeeded(categoryName, startRental, rentId) {
        return __awaiter(this, void 0, void 0, function* () {
            if (categoryName !== "Aluguel") {
                return null;
            }
            const [day, month, year] = startRental.split("/").map(Number);
            const currentDate = new Date();
            const startDate = new Date(year, month - 1, day); // (0-11) months in javascript go from 0 to 11
            const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
            const months = [];
            for (let date = new Date(startDate); date <= endDate; date.setMonth(date.getMonth() + 1)) {
                months.push(yield this.rentRepository.createRentMonth({
                    dateMonth: new Date(date),
                    rentId: rentId,
                }));
            }
            return months;
        });
    }
};
exports.CreateFinanceUseCase = CreateFinanceUseCase;
exports.CreateFinanceUseCase = CreateFinanceUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("FinanceRepository")),
    __param(1, (0, tsyringe_1.inject)("CategoryRepository")),
    __param(2, (0, tsyringe_1.inject)("RentRepository")),
    __metadata("design:paramtypes", [Object, Object, Object])
], CreateFinanceUseCase);
