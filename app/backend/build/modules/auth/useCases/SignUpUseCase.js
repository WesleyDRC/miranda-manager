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
exports.SignUpUseCase = void 0;
const tsyringe_1 = require("tsyringe");
const AppError_1 = require("../../../shared/errors/AppError");
const userConstants_1 = require("../constants/userConstants");
const User_1 = require("../entities/User");
let SignUpUseCase = class SignUpUseCase {
    constructor(authRepository, encryptManager, tokenManager) {
        this.authRepository = authRepository;
        this.encryptManager = encryptManager;
        this.tokenManager = tokenManager;
    }
    execute(_a) {
        return __awaiter(this, arguments, void 0, function* ({ email, password, confirmPassword, }) {
            const foundUser = yield this.authRepository.findByEmail(email);
            if (foundUser.length > 0) {
                throw new AppError_1.AppError(userConstants_1.userConstants.ALREADY_REGISTERED);
            }
            const user = User_1.User.create(email, password, confirmPassword);
            const encryptedPassword = yield this.encryptManager.generateHash(user.password);
            const userId = yield this.authRepository.create({
                email: email,
                password: encryptedPassword,
            });
            const token = this.tokenManager.generateToken(userId);
            return token;
        });
    }
};
exports.SignUpUseCase = SignUpUseCase;
exports.SignUpUseCase = SignUpUseCase = __decorate([
    (0, tsyringe_1.injectable)(),
    __param(0, (0, tsyringe_1.inject)("AuthRepository")),
    __param(1, (0, tsyringe_1.inject)("HashProvider")),
    __param(2, (0, tsyringe_1.inject)("TokenProvider")),
    __metadata("design:paramtypes", [Object, Object, Object])
], SignUpUseCase);
