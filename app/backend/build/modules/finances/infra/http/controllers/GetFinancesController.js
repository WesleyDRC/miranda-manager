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
exports.GetFinancesController = void 0;
const tsyringe_1 = require("tsyringe");
const GetFinancesUseCase_1 = require("../../../useCases/GetFinancesUseCase");
class GetFinancesController {
    handle(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = request.user.id;
            const getFinancesUseCase = tsyringe_1.container.resolve(GetFinancesUseCase_1.GetFinancesUseCase);
            const finances = yield getFinancesUseCase.execute({
                userId
            });
            return response.json({ finances });
        });
    }
}
exports.GetFinancesController = GetFinancesController;
