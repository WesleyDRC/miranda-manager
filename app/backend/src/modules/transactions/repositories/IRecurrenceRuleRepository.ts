import { ICreateRecurrenceRuleDTO } from "@/modules/transactions/dtos/ICreateRecurrenceRuleDTO";
import { IRecurrenceRule } from "@/modules/transactions/entities/IRecurrenceRule";

export interface IRecurrenceRuleRepository {
  create(data: ICreateRecurrenceRuleDTO): Promise<IRecurrenceRule>;
  findByUserId(userId: string): Promise<IRecurrenceRule[]>;
  findById(id: string): Promise<IRecurrenceRule | null>;
  delete(id: string): Promise<void>;
  update(id: string, data: Partial<IRecurrenceRule>): Promise<IRecurrenceRule>;
}
