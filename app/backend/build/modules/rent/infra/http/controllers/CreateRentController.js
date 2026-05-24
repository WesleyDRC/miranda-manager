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
exports.CreateRentController = void 0;
const CreateRentUseCase_1 = require("../../../useCases/CreateRentUseCase");
const tsyringe_1 = require("tsyringe");
class CreateRentController {
    handle(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = request.user.id;
            const { tenant, value, street, streetNumber, startRental } = request.body;
            const createRentUseCase = tsyringe_1.container.resolve(CreateRentUseCase_1.CreateRentUseCase);
            const rent = yield createRentUseCase.execute({
                tenant,
                value,
                street,
                streetNumber,
                startRental,
                userId
            });
            return response.json({ rent });
        });
    }
}
exports.CreateRentController = CreateRentController;
