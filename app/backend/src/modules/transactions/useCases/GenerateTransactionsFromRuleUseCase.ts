import { inject, injectable } from "tsyringe";

import { IUseCase } from "./ports/IUseCase";
import { ITransactionRepository } from "../repositories/ITransactionRepository";
import { IRecurrenceRuleRepository } from "../repositories/IRecurrenceRuleRepository";

@injectable()
export class GenerateTransactionsFromRuleUseCase implements IUseCase {
  constructor(
    @inject("TransactionRepository")
    private transactionRepository: ITransactionRepository,
    @inject("RecurrenceRuleRepository")
    private recurrenceRuleRepository: IRecurrenceRuleRepository
  ) {}

  async execute(recurrenceRuleId: string): Promise<void> {
    const rule = await this.recurrenceRuleRepository.findById(recurrenceRuleId);

    if (!rule) {
      throw new Error("Recurrence Rule not found");
    }

    let monthsToProject = 24; // Pre-generate 2 years of transactions by default
    if (rule.endDate) {
      const diffMonths = (rule.endDate.getFullYear() - rule.startDate.getFullYear()) * 12 + (rule.endDate.getMonth() - rule.startDate.getMonth()) + 1;
      if (diffMonths > 0) {
        monthsToProject = diffMonths;
      }
    }

    const startMonth = rule.startDate.getMonth();
    const startYear = rule.startDate.getFullYear();
    const transactionsData = [];

    for (let i = 0; i < monthsToProject; i++) {
      const projectionDate = new Date(startYear, startMonth + i, rule.dayOfMonth);

      // Stop if projection month is strictly after the end date month
      if (rule.endDate) {
        const projMonth = projectionDate.getFullYear() * 12 + projectionDate.getMonth();
        const endMonth = rule.endDate.getFullYear() * 12 + rule.endDate.getMonth();
        if (projMonth > endMonth) {
          break;
        }
      }

      transactionsData.push({
        type: rule.type,
        amount: rule.amount,
        dueDate: projectionDate,
        isPaid: false,
        isRecurring: true, // We keep this to flag that it came from a rule
        source: rule.source,
        description: rule.description,
        recurrenceRuleId: rule.id,
        userId: rule.userId,
      });
    }

    if (transactionsData.length > 0) {
      await this.transactionRepository.createMany(transactionsData);
    }
  }
}
