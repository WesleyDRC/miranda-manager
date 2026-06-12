import { inject, injectable } from "tsyringe";
import { ITransactionRepository } from "@/modules/transactions/repositories/ITransactionRepository";
import { IRecurrenceRuleRepository } from "@/modules/transactions/repositories/IRecurrenceRuleRepository";
import { AppError } from "@/shared/errors/AppError";

@injectable()
export class DeleteTransactionService {
  constructor(
    @inject("TransactionRepository")
    private transactionRepository: ITransactionRepository,
    @inject("RecurrenceRuleRepository")
    private recurrenceRuleRepository: IRecurrenceRuleRepository
  ) {}

  public async execute(id: string, userId: string, deleteHistory: boolean = false): Promise<void> {
    const transaction = await this.transactionRepository.findById(id);

    if (!transaction) {
      throw new AppError("Transaction not found", 404);
    }

    if (transaction.userId !== userId) {
      throw new AppError("Unauthorized", 401);
    }

    if (transaction.recurrenceRuleId) {
      if (deleteHistory) {
        await this.transactionRepository.deleteAllByRecurrenceRuleId(transaction.recurrenceRuleId);
      } else {
        // Deleta apenas as transacoes futuras nao pagas vinculadas a essa regra
        await this.transactionRepository.deleteByRecurrenceRuleId(transaction.recurrenceRuleId);
      }
      // Deleta a regra de recorrencia base
      await this.recurrenceRuleRepository.delete(transaction.recurrenceRuleId);
    } else {
      await this.transactionRepository.delete(id);
    }
  }
}
