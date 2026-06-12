import { inject, injectable } from "tsyringe";
import { AppError } from "@/shared/errors/AppError";
import { IWalletRepository } from "@/modules/wallets/repositories/IWalletRepository";

interface IRequest {
  id: string;
  userId: string;
}

@injectable()
export class DeleteWalletUseCase {
  constructor(
    @inject("WalletRepository")
    private walletRepository: IWalletRepository
  ) {}

  async execute({ id, userId }: IRequest): Promise<void> {
    const wallet = await this.walletRepository.findById(id);

    if (!wallet) {
      throw new AppError("Wallet not found", 404);
    }

    if (wallet.userId !== userId) {
      throw new AppError("Unauthorized", 401);
    }

    // TODO: Ideally we should check if wallet has transactions or just let it be deleted.
    await this.walletRepository.delete(id);
  }
}
