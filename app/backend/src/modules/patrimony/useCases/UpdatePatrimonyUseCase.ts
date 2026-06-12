import { inject, injectable } from "tsyringe";

import { IUseCase } from "./ports/IUseCase";
import { IPatrimonyRepository } from "../repositories/IPatrimonyRepository";
import { ITransactionRepository } from "../../transactions/repositories/ITransactionRepository";
import { IPatrimony } from "../entities/IPatrimony";

interface IRequest {
  id: string;
  data: Partial<IPatrimony>;
}

@injectable()
export class UpdatePatrimonyUseCase implements IUseCase {
  constructor(
    @inject("PatrimonyRepository")
    private patrimonyRepository: IPatrimonyRepository,
    @inject("TransactionRepository")
    private transactionRepository: ITransactionRepository
  ) {}

  async execute({ id, data }: IRequest): Promise<IPatrimony> {
    const patrimony = await this.patrimonyRepository.update(id, data);
    
    // Se removeu o financiamento, remove as parcelas pendentes
    if (data.isFinanced === false) {
      await this.transactionRepository.deleteByPatrimonyId(id);
    }
    
    return patrimony;
  }
}
