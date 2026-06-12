import { ICreateWalletDTO } from "../../../dtos/ICreateWalletDTO";
import { IWalletRepository } from "../../../repositories/IWalletRepository";
import { Wallet } from "../entities/Wallet";
import { IWallet } from "../../../entities/IWallet";
import { AppError } from "../../../../../shared/errors/AppError";

export class WalletRepository implements IWalletRepository {
  async create({ name, balance, userId }: ICreateWalletDTO): Promise<IWallet> {
    const createdWallet = await Wallet.create({ name, balance, userId });

    const wallet: IWallet = {
      id: createdWallet.id,
      name: createdWallet.name,
      balance: createdWallet.balance,
      userId: createdWallet.userId,
    };

    return Promise.resolve(wallet);
  }

  async findByUserId(userId: string): Promise<IWallet[]> {
    const walletsFound = await Wallet.find({ userId });

    let wallets: IWallet[] = [];

    for (let i = 0; i < walletsFound.length; i++) {
      const wallet: IWallet = {
        id: walletsFound[i].id,
        name: walletsFound[i].name,
        balance: walletsFound[i].balance,
        userId: walletsFound[i].userId,
      };

      wallets.push(wallet);
    }

    return Promise.resolve(wallets);
  }

  async findById(id: string): Promise<IWallet | null> {
    const walletFound = await Wallet.findOne({ _id: id });

    if (!walletFound) {
      return null;
    }

    return {
      id: walletFound._id,
      name: walletFound.name,
      balance: walletFound.balance,
      userId: walletFound.userId,
    };
  }

  async updateBalance(id: string, balance: number): Promise<IWallet> {
    const wallet = await Wallet.findOneAndUpdate(
      { _id: id },
      { balance },
      { new: true }
    );

    if (!wallet) {
      throw new AppError("Wallet not found", 404);
    }

    return {
      id: wallet._id,
      name: wallet.name,
      balance: wallet.balance,
      userId: wallet.userId,
    };
  }
}
