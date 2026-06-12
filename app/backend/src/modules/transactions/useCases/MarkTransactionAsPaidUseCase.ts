import { inject, injectable } from "tsyringe";

import { IUseCase } from "./ports/IUseCase";
import { ITransactionRepository } from "../repositories/ITransactionRepository";
import { IWalletRepository } from "../../wallets/repositories/IWalletRepository";
import { ITransaction } from "../entities/ITransaction";
import { AppError } from "../../../shared/errors/AppError";

interface IRequest {
  id: string;
  walletId: string;
}

@injectable()
export class MarkTransactionAsPaidUseCase implements IUseCase {
  constructor(
    @inject("TransactionRepository")
    private transactionRepository: ITransactionRepository,
    @inject("WalletRepository")
    private walletRepository: IWalletRepository
  ) {}

  async execute({ id, walletId }: IRequest): Promise<ITransaction> {
    const tx = await this.transactionRepository.findById(id);

    if (!tx) {
      throw new AppError("Transaction not found", 404);
    }

    if (tx.isPaid) {
      throw new AppError("Transaction is already paid", 400);
    }

    // O repositório markAsPaid agora executa a Sessão Mongoose (ACID),
    // deduzindo da wallet e criando o LedgerEntry atomicamente.

    // Mark as paid
    const updatedTx = await this.transactionRepository.markAsPaid(id, walletId);

    return updatedTx;
  }
}
