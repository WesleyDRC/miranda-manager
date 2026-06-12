import { inject, injectable } from "tsyringe";

import { IUseCase } from "@/modules/transactions/useCases/ports/IUseCase";
import { ITransactionRepository } from "@/modules/transactions/repositories/ITransactionRepository";
import { ITransaction } from "@/modules/transactions/entities/ITransaction";

@injectable()
export class ListTransactionsByPatrimonyUseCase implements IUseCase {
  constructor(
    @inject("TransactionRepository")
    private transactionRepository: ITransactionRepository
  ) {}

  async execute(patrimonyId: string): Promise<ITransaction[]> {
    const transactions = await this.transactionRepository.findByPatrimonyId(patrimonyId);
    return transactions;
  }
}
