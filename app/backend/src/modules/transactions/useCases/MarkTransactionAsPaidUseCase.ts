import mongoose from "mongoose";
import { inject, injectable } from "tsyringe";

import { IUseCase } from "./ports/IUseCase";
import { ITransactionRepository } from "../repositories/ITransactionRepository";
import { IWalletRepository } from "../../wallets/repositories/IWalletRepository";
import { ITransaction } from "../entities/ITransaction";
import { AppError } from "../../../shared/errors/AppError";
import { LedgerEntry } from "../../wallets/infra/mongoose/entities/LedgerEntry";

interface IRequest {
  id: string;
  walletId: string;
}

@injectable()
export class MarkTransactionAsPaidUseCase implements IUseCase<IRequest, ITransaction> {
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

    const session = await mongoose.startSession();
    let updatedTx: ITransaction;

    try {
      await session.withTransaction(async () => {
        // Mark as paid
        updatedTx = await this.transactionRepository.markAsPaid(id, walletId, session);

        // Update Wallet Balance
        const amountToApply = tx.type === "INCOME" ? tx.amount : -tx.amount;
        await this.walletRepository.incrementBalance(walletId, amountToApply, session);

        // Create Ledger Entry
        await LedgerEntry.create([{
          walletId: walletId,
          transactionId: tx.id,
          type: tx.type === "INCOME" ? "CREDIT" : "DEBIT",
          amount: tx.amount,
          description: `Pagamento da transação: ${tx.description}`,
        }], { session });
      });
    } catch (err) {
      throw err;
    } finally {
      await session.endSession();
    }

    return updatedTx!;
  }
}
