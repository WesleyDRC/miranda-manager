import { inject, injectable } from "tsyringe";
import { AppError } from "@/shared/errors/AppError";
import { IWallet } from "@/modules/wallets/entities/IWallet";
import { IWalletRepository } from "@/modules/wallets/repositories/IWalletRepository";

interface IRequest {
  id: string;
  name?: string;
  balance?: number;
  userId: string;
}

@injectable()
export class UpdateWalletUseCase {
  constructor(
    @inject("WalletRepository")
    private walletRepository: IWalletRepository
  ) {}

  async execute({ id, name, balance, userId }: IRequest): Promise<IWallet> {
    const wallet = await this.walletRepository.findById(id);

    if (!wallet) {
      throw new AppError("Wallet not found", 404);
    }

    if (wallet.userId !== userId) {
      throw new AppError("Unauthorized", 401);
    }

    const updatedWallet = await this.walletRepository.update(id, { name, balance });

    return updatedWallet;
  }
}
