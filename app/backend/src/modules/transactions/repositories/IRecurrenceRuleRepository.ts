import { ICreateRecurrenceRuleDTO } from "../dtos/ICreateRecurrenceRuleDTO";
import { IRecurrenceRule } from "../entities/IRecurrenceRule";

export interface IRecurrenceRuleRepository {
  create(data: ICreateRecurrenceRuleDTO): Promise<IRecurrenceRule>;
  findByUserId(userId: string): Promise<IRecurrenceRule[]>;
  findById(id: string): Promise<IRecurrenceRule | null>;
  delete(id: string): Promise<void>;
  update(id: string, data: Partial<IRecurrenceRule>): Promise<IRecurrenceRule>;
}
