import { ICreateRecurrenceRuleDTO } from "@/modules/transactions/dtos/ICreateRecurrenceRuleDTO";
import { IRecurrenceRuleRepository } from "@/modules/transactions/repositories/IRecurrenceRuleRepository";
import { RecurrenceRule } from "@/modules/transactions/infra/mongoose/entities/RecurrenceRule";
import { IRecurrenceRule } from "@/modules/transactions/entities/IRecurrenceRule";

export class RecurrenceRuleRepository implements IRecurrenceRuleRepository {
  async create(data: ICreateRecurrenceRuleDTO): Promise<IRecurrenceRule> {
    const createdRule = await RecurrenceRule.create(data);

    return {
      id: createdRule.id,
      type: createdRule.type as "INCOME" | "EXPENSE",
      amount: createdRule.amount,
      dayOfMonth: createdRule.dayOfMonth,
      source: createdRule.source as "MANUAL" | "RENT" | "FINANCING",
      description: createdRule.description,
      startDate: createdRule.startDate,
      endDate: createdRule.endDate,
      userId: createdRule.userId,
    };
  }

  async findByUserId(userId: string): Promise<IRecurrenceRule[]> {
    const rules = await RecurrenceRule.find({ userId });

    return rules.map(rule => ({
      id: rule.id,
      type: rule.type as "INCOME" | "EXPENSE",
      amount: rule.amount,
      dayOfMonth: rule.dayOfMonth,
      source: rule.source as "MANUAL" | "RENT" | "FINANCING",
      description: rule.description,
      startDate: rule.startDate,
      endDate: rule.endDate,
      userId: rule.userId,
    }));
  }

  async findById(id: string): Promise<IRecurrenceRule | null> {
    const rule = await RecurrenceRule.findOne({ _id: id });

    if (!rule) {
      return null;
    }

    return {
      id: rule.id,
      type: rule.type as "INCOME" | "EXPENSE",
      amount: rule.amount,
      dayOfMonth: rule.dayOfMonth,
      source: rule.source as "MANUAL" | "RENT" | "FINANCING",
      description: rule.description,
      startDate: rule.startDate,
      endDate: rule.endDate,
      userId: rule.userId,
    };
  }

  async delete(id: string): Promise<void> {
    await RecurrenceRule.deleteOne({ _id: id });
  }

  async update(id: string, data: Partial<IRecurrenceRule>): Promise<IRecurrenceRule> {
    const updatedRule = await RecurrenceRule.findByIdAndUpdate(
      id,
      { $set: data },
      { new: true }
    );

    if (!updatedRule) {
      throw new Error("Recurrence Rule not found");
    }

    return {
      id: updatedRule.id,
      type: updatedRule.type as "INCOME" | "EXPENSE",
      amount: updatedRule.amount,
      dayOfMonth: updatedRule.dayOfMonth,
      source: updatedRule.source as "MANUAL" | "RENT" | "FINANCING",
      description: updatedRule.description,
      startDate: updatedRule.startDate,
      endDate: updatedRule.endDate,
      userId: updatedRule.userId,
    };
  }
}
