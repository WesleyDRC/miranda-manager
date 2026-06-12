import { inject, injectable } from "tsyringe";

import { AppError } from "@/shared/errors/AppError";

import { IAuthRepository } from "@/modules/auth/repositories/IAuthRepository";
import { IStoreUserDTO } from "@/modules/auth/dtos/IStoreUserDTO";
import { IEncryptManager } from "@/modules/auth/useCases/ports/IEncryptManager";
import { ITokenManager } from "@/modules/auth/useCases/ports/ITokenManager";
import { IUseCase } from "@/modules/auth/useCases/ports/IUseCase";

import { userConstants } from "@/modules/auth/constants/userConstants";
import { User } from "@/modules/auth/entities/User";

@injectable()
export class SignUpUseCase implements IUseCase {
  constructor(
    @inject("AuthRepository")
    private authRepository: IAuthRepository,

    @inject("HashProvider")
    private encryptManager: IEncryptManager,

    @inject("TokenProvider")
    private tokenManager: ITokenManager
  ) {}

  async execute({
    email,
    password,
    confirmPassword,
  }: IStoreUserDTO): Promise<string> {
    const foundUser = await this.authRepository.findByEmail(email);

    if (foundUser.length > 0) {
      throw new AppError(userConstants.ALREADY_REGISTERED);
    }

    const user = User.create(email, password, confirmPassword);

    const encryptedPassword = await this.encryptManager.generateHash(
      user.password
    );

    const userId = await this.authRepository.create({
      email: email,
      password: encryptedPassword,
    });

    const token = this.tokenManager.generateToken(userId);

    return token;
  }
}
