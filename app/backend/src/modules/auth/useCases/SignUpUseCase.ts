import { inject, injectable } from "tsyringe";
import { IAuthRepository } from "../repositories/IAuthRepository";
import { IStoreUserDTO } from "../dtos/IStoreUserDTO";

import { userConstants } from "../constants/userConstants";
import { User } from "../entities/User"
import { AppError } from "../../../shared/errors/AppError";

@injectable()
export class SignUpUseCase {
  constructor(
    @inject("AuthRepository")
    private authRepository: IAuthRepository
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

    const userId = await this.authRepository.create({
      email: email,
      password: password,
    });

    return userId;
  }
}
