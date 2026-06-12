import { inject, injectable } from "tsyringe";

import { IUseCase } from "./ports/IUseCase";
import { IPatrimonyRepository } from "../repositories/IPatrimonyRepository";
import { ITransactionRepository } from "../../transactions/repositories/ITransactionRepository";
import { ICreatePatrimonyDTO } from "../dtos/ICreatePatrimonyDTO";
import { IPatrimony } from "../entities/IPatrimony";

@injectable()
export class CreatePatrimonyUseCase implements IUseCase {
  constructor(
    @inject("PatrimonyRepository")
    private patrimonyRepository: IPatrimonyRepository,
    @inject("TransactionRepository")
    private transactionRepository: ITransactionRepository
  ) {}

  async execute({
    name,
    type,
    marketValue,
    isFinanced,
    financingDetails,
    userId,
  }: ICreatePatrimonyDTO): Promise<IPatrimony> {
    const patrimony = await this.patrimonyRepository.create({
      name,
      type,
      marketValue,
      isFinanced,
      financingDetails,
      userId,
    });

    if (isFinanced && financingDetails && financingDetails.startDate && financingDetails.endDate) {
      const start = new Date(financingDetails.startDate);
      const end = new Date(financingDetails.endDate);
      const promises = [];
      
      const totalMonths = (end.getUTCFullYear() - start.getUTCFullYear()) * 12 + (end.getUTCMonth() - start.getUTCMonth()) + 1;

      for (let i = 0; i < totalMonths; i++) {
        const dueDate = new Date(start.getUTCFullYear(), start.getUTCMonth() + i, financingDetails.dueDateDay || 10);
        promises.push(
          this.transactionRepository.create({
            type: "EXPENSE",
            amount: financingDetails.installmentValue,
            dueDate,
            isPaid: false,
            isRecurring: false,
            source: "FINANCING",
            description: `Parcela ${i + 1}/${totalMonths} - ${name}`,
            patrimonyId: patrimony.id,
            userId,
          })
        );
      }
      await Promise.all(promises);
    }

    return patrimony;
  }
}
