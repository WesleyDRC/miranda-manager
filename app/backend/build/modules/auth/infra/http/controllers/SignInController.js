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
exports.SignInController = void 0;
const SignInUseCase_1 = require("../../../useCases/SignInUseCase");
const tsyringe_1 = require("tsyringe");
class SignInController {
    handle(request, response) {
        return __awaiter(this, void 0, void 0, function* () {
            const { email, password } = request.body;
            const signInUseCase = tsyringe_1.container.resolve(SignInUseCase_1.SignInUseCase);
            const token = yield signInUseCase.execute({ email, password });
            return response.json({ token });
        });
    }
}
exports.SignInController = SignInController;
