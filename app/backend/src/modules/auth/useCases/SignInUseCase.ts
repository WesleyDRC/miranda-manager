import { inject, injectable } from "tsyringe";

import { AppError } from "@/shared/errors/AppError";

import { IUseCase } from "@/modules/auth/useCases/ports/IUseCase";
import { IAuthRepository } from "@/modules/auth/repositories/IAuthRepository";
import { IEncryptManager } from "@/modules/auth/useCases/ports/IEncryptManager";

import { userConstants } from "@/modules/auth/constants/userConstants";
import { ITokenManager } from "@/modules/auth/useCases/ports/ITokenManager";

@injectable()
export class SignInUseCase implements IUseCase {
	constructor(
		@inject("AuthRepository")
		private authRepository: IAuthRepository,

		@inject("HashProvider")
		private encryptManager: IEncryptManager,

		@inject("TokenProvider")
		private tokenManager: ITokenManager
	) {}

  public async execute({email, password}): Promise<string> {
		const foundUser = await this.authRepository.findByEmail(email)

		if (foundUser.length <= 0) {
			throw new AppError(userConstants.NOT_FOUND, 404)
		} 

		const isCorrectPassword = await this.encryptManager.compareHash(
			password,
			foundUser[0].password
		)

		if (!isCorrectPassword)
			throw new AppError(userConstants.INCORRECT_PASSWORD, 401)

		const token = this.tokenManager.generateToken(foundUser[0]._id)

    return token;
  }
}
