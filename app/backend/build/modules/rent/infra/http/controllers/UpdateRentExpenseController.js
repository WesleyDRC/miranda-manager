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
exports.UpdateRentExpenseController = void 0;
const UpdateRentExpenseUseCase_1 = require("../../../useCases/UpdateRentExpenseUseCase");
const tsyringe_1 = require("tsyringe");
class UpdateRentExpenseController {
    handle(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { amount, reason } = request.body;
            const userId = request.user.id;
            const { rentExpenseId } = request.params;
            const updateRentExpenseUseCase = tsyringe_1.container.resolve(UpdateRentExpenseUseCase_1.UpdateRentExpenseUseCase);
            const rentExpense = yield updateRentExpenseUseCase.execute({
                rentExpenseId,
                userId,
                updates: {
                    amount,
                    reason,
                },
            });
            return response.json({ rentExpense });
        });
    }
}
exports.UpdateRentExpenseController = UpdateRentExpenseController;
