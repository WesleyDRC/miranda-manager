import { inject, injectable } from "tsyringe";

import { IUseCase } from "./ports/IUseCase";
import { IWalletRepository } from "../repositories/IWalletRepository";
import { IWallet } from "../entities/IWallet";

@injectable()
export class ListWalletsUseCase implements IUseCase {
  constructor(
    @inject("WalletRepository")
    private walletRepository: IWalletRepository
  ) {}

  async execute(userId: string): Promise<IWallet[]> {
    const wallets = await this.walletRepository.findByUserId(userId);
    return wallets;
  }
}
