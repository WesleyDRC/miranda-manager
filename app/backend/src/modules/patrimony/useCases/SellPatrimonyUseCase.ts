import { inject, injectable } from "tsyringe";

import { IUseCase } from "./ports/IUseCase";
import { IPatrimonyRepository } from "../repositories/IPatrimonyRepository";
import { ITransactionRepository } from "../../transactions/repositories/ITransactionRepository";

@injectable()
export class SellPatrimonyUseCase implements IUseCase {
  constructor(
    @inject("PatrimonyRepository")
    private patrimonyRepository: IPatrimonyRepository,
    @inject("TransactionRepository")
    private transactionRepository: ITransactionRepository
  ) {}

  async execute(id: string): Promise<void> {
    await this.transactionRepository.deleteByPatrimonyId(id);
    await this.patrimonyRepository.delete(id);
  }
}
