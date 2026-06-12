import { ICreateTransactionDTO } from "../dtos/ICreateTransactionDTO";
import { ITransaction } from "../entities/ITransaction";

export interface ITransactionRepository {
  create(data: ICreateTransactionDTO): Promise<ITransaction>;
  findByUserId(userId: string): Promise<ITransaction[]>;
  findById(id: string): Promise<ITransaction | null>;
  findByPatrimonyId(patrimonyId: string): Promise<ITransaction[]>;
  markAsPaid(id: string, walletId: string): Promise<ITransaction>;
  update(id: string, data: Partial<ITransaction>): Promise<ITransaction>;
  delete(id: string): Promise<void>;
  deleteByRecurrenceRuleId(ruleId: string): Promise<void>;
  deleteByPatrimonyId(patrimonyId: string): Promise<void>;
  updateFutureUnpaidByRuleId(ruleId: string, data: Partial<ITransaction>): Promise<void>;
  deleteUnpaidAfterDateByRuleId(ruleId: string, date: Date): Promise<void>;
  deleteAllByRecurrenceRuleId(ruleId: string): Promise<void>;
  findByRecurrenceRuleId(ruleId: string): Promise<ITransaction[]>;
}
