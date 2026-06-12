import { ICreateWalletDTO } from "@/modules/wallets/dtos/ICreateWalletDTO";
import { IWallet } from "@/modules/wallets/entities/IWallet";

export interface IWalletRepository {
  create(data: ICreateWalletDTO): Promise<IWallet>;
  findByUserId(userId: string): Promise<IWallet[]>;
  findById(id: string): Promise<IWallet | null>;
  updateBalance(id: string, balance: number): Promise<IWallet>;
  incrementBalance(id: string, amount: number, session?: any): Promise<IWallet>;
  update(id: string, data: { name?: string, balance?: number }): Promise<IWallet>;
  delete(id: string): Promise<void>;
}
