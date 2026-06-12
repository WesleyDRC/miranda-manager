import { inject, injectable } from "tsyringe";

import { IUseCase } from "@/modules/wallets/useCases/ports/IUseCase";
import { IWalletRepository } from "@/modules/wallets/repositories/IWalletRepository";
import { ICreateWalletDTO } from "@/modules/wallets/dtos/ICreateWalletDTO";
import { IWallet } from "@/modules/wallets/entities/IWallet";

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
