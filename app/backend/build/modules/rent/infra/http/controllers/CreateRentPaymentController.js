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
exports.CreateRentPaymentController = void 0;
const CreateRentPaymentUseCase_1 = require("../../../useCases/CreateRentPaymentUseCase");
const tsyringe_1 = require("tsyringe");
class CreateRentPaymentController {
    handle(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { amount, paymentDate, rentMonthId } = request.body;
            const userId = request.user.id;
            const createRentPaymentUseCase = tsyringe_1.container.resolve(CreateRentPaymentUseCase_1.CreateRentPaymentUseCase);
            const payment = yield createRentPaymentUseCase.execute({
                amount,
                paymentDate,
                rentMonthId,
                userId
            });
            return response.json({ payment });
        });
    }
}
exports.CreateRentPaymentController = CreateRentPaymentController;
