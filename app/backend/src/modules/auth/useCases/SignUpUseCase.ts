import { inject, injectable } from "tsyringe";

import { AppError } from "../../../shared/errors/AppError";

import { IAuthRepository } from "../repositories/IAuthRepository";
import { IStoreUserDTO } from "../dtos/IStoreUserDTO";
import { IEncryptManager } from "./ports/IEncryptManager";
import { ITokenManager } from "./ports/ITokenManager";

import { userConstants } from "../constants/userConstants";
import { User } from "../entities/User";

@injectable()
export class SignUpUseCase {
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
