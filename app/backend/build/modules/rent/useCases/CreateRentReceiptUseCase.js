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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CreateRentReceiptUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const rentConstants_1 = require("../contants/rentConstants");
const getAppDataFolder_1 = require("../../../shared/utils/getAppDataFolder");
const AppError_1 = require("../../../shared/errors/AppError");
let CreateRentReceiptUseCase = class CreateRentReceiptUseCase {
    constructor(rentRepository) {
        this.rentRepository = rentRepository;
    }
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ receipt, rentMonthId, }) {
            const rentMonth = yield this.rentRepository.findRentMonthById({ id: rentMonthId });
            if (!rentMonth) {
                throw new AppError_1.AppError(rentConstants_1.rentConstants.RENT_MONTH_NOT_FOUND, 404);
            }
            if (!receipt) {
                throw new AppError_1.AppError(rentConstants_1.rentConstants.UPLOAD_VALID_FILE, 400);
            }
            const tempFilePath = this.getReceiptPath(receipt);
            const newFilePath = `${(0, getAppDataFolder_1.getAppDataPath)()}/rent/receipts/${path_1.default.basename(tempFilePath)}`;
            const newDir = path_1.default.dirname(newFilePath);
            if (!fs_1.default.existsSync(tempFilePath)) {
                throw new AppError_1.AppError(rentConstants_1.rentConstants.FILE_NOT_FOUND, 404);
            }
            if (!fs_1.default.existsSync(newDir)) {
                fs_1.default.mkdirSync(newDir, { recursive: true });
            }
            // Move the file (temporary file will be removed automatically)
            fs_1.default.renameSync(tempFilePath, newFilePath);
            receipt = newFilePath;
            const rentReceipt = yield this.rentRepository.createRentReceipt({
                receipt,
                rentMonthId: rentMonth.id,
            });
            return rentReceipt;
        });
    }
    getReceiptPath(receipt) {
        if (typeof receipt === "string") {
            return receipt;
        }
        if ("path" in receipt) {
            return receipt.path;
        }
        throw new AppError_1.AppError("Formato de arquivo inválido.", 400);
    }
};
exports.CreateRentReceiptUseCase = CreateRentReceiptUseCase;
exports.CreateRentReceiptUseCase = CreateRentReceiptUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("RentRepository")),
    __metadata("design:paramtypes", [Object])
], CreateRentReceiptUseCase);
