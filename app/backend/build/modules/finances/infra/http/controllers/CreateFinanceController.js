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
exports.CreateFinanceController = void 0;
const tsyringe_1 = require("tsyringe");
const CreateFinanceUseCase_1 = require("../../../useCases/CreateFinanceUseCase");
class CreateFinanceController {
    handle(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = request.user.id;
            const { name, category, rent } = request.body;
            const createFinanceUseCase = tsyringe_1.container.resolve(CreateFinanceUseCase_1.CreateFinanceUseCase);
            const finance = yield createFinanceUseCase.execute({
                name,
                rent,
                category,
                userId,
            });
            return response.json({ finance });
        });
    }
}
exports.CreateFinanceController = CreateFinanceController;
