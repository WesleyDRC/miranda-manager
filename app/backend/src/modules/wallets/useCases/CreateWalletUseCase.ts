import { inject, injectable } from "tsyringe";

import { IUseCase } from "./ports/IUseCase";
import { IWalletRepository } from "../repositories/IWalletRepository";
import { ICreateWalletDTO } from "../dtos/ICreateWalletDTO";
import { IWallet } from "../entities/IWallet";

@injectable()
export class CreateWalletUseCase implements IUseCase {
  constructor(
    @inject("WalletRepository")
    private walletRepository: IWalletRepository
  ) {}

  async execute({ name, balance, userId }: ICreateWalletDTO): Promise<IWallet> {
    const createWallet = await this.walletRepository.create({
      name,
      balance,
      userId,
    });

    return createWallet;
  }
}
