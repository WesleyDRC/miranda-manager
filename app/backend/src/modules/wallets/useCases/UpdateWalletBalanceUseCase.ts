import { inject, injectable } from "tsyringe";

import { IUseCase } from "@/modules/wallets/useCases/ports/IUseCase";
import { IWalletRepository } from "@/modules/wallets/repositories/IWalletRepository";
import { IWallet } from "@/modules/wallets/entities/IWallet";

interface IRequest {
  id: string;
  balance: number;
}

@injectable()
export class UpdateWalletBalanceUseCase implements IUseCase {
  constructor(
    @inject("WalletRepository")
    private walletRepository: IWalletRepository
  ) {}

  async execute({ id, balance }: IRequest): Promise<IWallet> {
    const updatedWallet = await this.walletRepository.updateBalance(id, balance);
    return updatedWallet;
  }
}
