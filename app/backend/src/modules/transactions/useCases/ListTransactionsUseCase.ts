import { inject, injectable } from "tsyringe";

import { IUseCase } from "./ports/IUseCase";
import { ITransactionRepository } from "../repositories/ITransactionRepository";
import { ITransaction } from "../entities/ITransaction";

@injectable()
export class ListTransactionsUseCase implements IUseCase {
  constructor(
    @inject("TransactionRepository")
    private transactionRepository: ITransactionRepository
  ) {}

  async execute(userId: string): Promise<ITransaction[]> {
    const txs = await this.transactionRepository.findByUserId(userId);
    return txs;
  }
}
