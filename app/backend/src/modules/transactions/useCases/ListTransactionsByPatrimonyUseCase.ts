import { inject, injectable } from "tsyringe";

import { IUseCase } from "./ports/IUseCase";
import { ITransactionRepository } from "../repositories/ITransactionRepository";
import { ITransaction } from "../entities/ITransaction";

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
