import { ICreateWalletDTO } from "../dtos/ICreateWalletDTO";
import { IWallet } from "../entities/IWallet";

export interface IWalletRepository {
  create(data: ICreateWalletDTO): Promise<IWallet>;
  findByUserId(userId: string): Promise<IWallet[]>;
  findById(id: string): Promise<IWallet | null>;
  updateBalance(id: string, balance: number): Promise<IWallet>;
}
