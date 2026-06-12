import { inject, injectable } from "tsyringe";
import { ITransactionRepository } from "../repositories/ITransactionRepository";
import { IRecurrenceRuleRepository } from "../repositories/IRecurrenceRuleRepository";
import { ITransaction } from "../entities/ITransaction";
import { AppError } from "../../../shared/errors/AppError";

interface IRequest {
  id: string;
  userId: string;
  amount?: number;
  dueDate?: Date;
  description?: string;
  isPaid?: boolean;
  updateRule?: boolean;
  endDate?: Date;
}

@injectable()
export class UpdateTransactionUseCase {
  constructor(
    @inject("TransactionRepository")
    private transactionRepository: ITransactionRepository,
    @inject("RecurrenceRuleRepository")
    private recurrenceRuleRepository: IRecurrenceRuleRepository
  ) {}

  async execute({ id, userId, amount, dueDate, description, isPaid, updateRule, endDate }: IRequest): Promise<ITransaction> {
    const transaction = await this.transactionRepository.findById(id);

    if (!transaction) {
      throw new AppError("Transaction not found", 404);
    }

    if (transaction.userId !== userId) {
      throw new AppError("Unauthorized", 401);
    }

    const updates: Partial<ITransaction> = {};
    if (amount !== undefined) updates.amount = amount;
    if (dueDate !== undefined) updates.dueDate = dueDate;
    if (description !== undefined) updates.description = description;
    if (isPaid !== undefined) updates.isPaid = isPaid;

    const updatedTransaction = await this.transactionRepository.update(id, updates);

    if (updateRule && transaction.recurrenceRuleId) {
      const ruleUpdates: any = {};
      if (amount !== undefined) ruleUpdates.amount = amount;
      if (description !== undefined) ruleUpdates.description = description;
      if (endDate !== undefined) ruleUpdates.endDate = endDate;
      
      if (Object.keys(ruleUpdates).length > 0) {
        await this.recurrenceRuleRepository.update(transaction.recurrenceRuleId, ruleUpdates);
        await this.transactionRepository.updateFutureUnpaidByRuleId(transaction.recurrenceRuleId, ruleUpdates);
      }

      if (endDate !== undefined) {
        await this.transactionRepository.deleteUnpaidAfterDateByRuleId(transaction.recurrenceRuleId, endDate);

        // Gera as transações adicionais se a data for estendida
        const ruleTxs = await this.transactionRepository.findByRecurrenceRuleId(transaction.recurrenceRuleId);
        if (ruleTxs.length > 0) {
          const maxDueDate = ruleTxs.reduce((max, tx) => tx.dueDate > max ? tx.dueDate : max, ruleTxs[0].dueDate);
          
          if (endDate > maxDueDate) {
            const rule = await this.recurrenceRuleRepository.findById(transaction.recurrenceRuleId);
            if (rule) {
              const startMonth = maxDueDate.getMonth() + 1;
              const startYear = maxDueDate.getFullYear();
              
              const diffMonths = (endDate.getFullYear() - maxDueDate.getFullYear()) * 12 + (endDate.getMonth() - maxDueDate.getMonth());
              
              const promises = [];
              for (let i = 0; i <= diffMonths + 1; i++) {
                const projectionDate = new Date(startYear, startMonth + i, rule.dayOfMonth);
                
                const projMonth = projectionDate.getFullYear() * 12 + projectionDate.getMonth();
                const endMonth = endDate.getFullYear() * 12 + endDate.getMonth();
                if (projMonth > endMonth) break;

                promises.push(
                  this.transactionRepository.create({
                    type: rule.type,
                    amount: rule.amount,
                    dueDate: projectionDate,
                    isPaid: false,
                    isRecurring: true,
                    source: rule.source,
                    description: rule.description,
                    recurrenceRuleId: rule.id,
                    userId: rule.userId,
                  })
                );
              }
              await Promise.all(promises);
            }
          }
        }
      }
    }

    return updatedTransaction;
  }
}
