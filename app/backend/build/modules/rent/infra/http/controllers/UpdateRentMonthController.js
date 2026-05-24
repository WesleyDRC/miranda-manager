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
exports.UpdateRentMonthController = void 0;
const UpdateRentMonthUseCase_1 = require("../../../useCases/UpdateRentMonthUseCase");
const tsyringe_1 = require("tsyringe");
class UpdateRentMonthController {
    handle(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { dateMonth, amountPaid, paid, } = request.body;
            const userId = request.user.id;
            const { rentId, rentMonthId } = request.params;
            const updateRentMonthUseCase = tsyringe_1.container.resolve(UpdateRentMonthUseCase_1.UpdateRentMonthUseCase);
            const rentMonth = yield updateRentMonthUseCase.execute({
                rentMonthId,
                userId,
                rentId,
                updates: {
                    dateMonth,
                    amountPaid,
                    paid,
                }
            });
            return response.json({ rentMonth });
        });
    }
}
exports.UpdateRentMonthController = UpdateRentMonthController;
