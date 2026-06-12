import { inject, injectable } from "tsyringe";

import { IUseCase } from "@/modules/wallets/useCases/ports/IUseCase";
import { IWalletRepository } from "@/modules/wallets/repositories/IWalletRepository";
import { IWallet } from "@/modules/wallets/entities/IWallet";

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
