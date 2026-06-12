import { inject, injectable } from "tsyringe";

import { IUseCase } from "@/modules/patrimony/useCases/ports/IUseCase";
import { IPatrimonyRepository } from "@/modules/patrimony/repositories/IPatrimonyRepository";
import { ITransactionRepository } from "@/modules/transactions/repositories/ITransactionRepository";

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
