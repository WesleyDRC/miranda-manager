import { inject, injectable } from "tsyringe";

import { IUseCase } from "@/modules/transactions/useCases/ports/IUseCase";
import { ITransactionRepository } from "@/modules/transactions/repositories/ITransactionRepository";
import { ITransaction } from "@/modules/transactions/entities/ITransaction";

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
