import { inject, injectable } from "tsyringe";

import { IUseCase } from "./ports/IUseCase";
import { ITransactionRepository } from "../repositories/ITransactionRepository";
import { ICreateTransactionDTO } from "../dtos/ICreateTransactionDTO";
import { ITransaction } from "../entities/ITransaction";

import { IRecurrenceRuleRepository } from "../repositories/IRecurrenceRuleRepository";
import { GenerateTransactionsFromRuleUseCase } from "./GenerateTransactionsFromRuleUseCase";
import { container } from "tsyringe";

@injectable()
export class CreateTransactionUseCase implements IUseCase {
  constructor(
    @inject("TransactionRepository")
    private transactionRepository: ITransactionRepository,
    @inject("RecurrenceRuleRepository")
    private recurrenceRuleRepository: IRecurrenceRuleRepository
  ) {}

  async execute(data: ICreateTransactionDTO): Promise<ITransaction> {
    if (data.isRecurring) {
      // Create the Recurrence Rule
      const rule = await this.recurrenceRuleRepository.create({
        type: data.type,
        amount: data.amount,
        dayOfMonth: new Date(data.dueDate).getDate(),
        source: data.source || "MANUAL",
        description: data.description,
        startDate: data.dueDate,
        endDate: data.endDate,
        userId: data.userId
      });

      // Trigger Domain Service to project transactions
      const generator = container.resolve(GenerateTransactionsFromRuleUseCase);
      await generator.execute(rule.id);

      // Return a "dummy" or the first projected transaction format so the frontend doesn't break
      return {
        id: rule.id,
        type: rule.type,
        amount: rule.amount,
        dueDate: rule.startDate,
        isPaid: false,
        isRecurring: true,
        source: rule.source,
        description: rule.description,
        recurrenceRuleId: rule.id,
        userId: rule.userId,
      };
    }

    const createTx = await this.transactionRepository.create(data);
    return createTx;
  }
}
