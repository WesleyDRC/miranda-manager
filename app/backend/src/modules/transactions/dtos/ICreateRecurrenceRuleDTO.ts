export interface ICreateRecurrenceRuleDTO {
  type: "INCOME" | "EXPENSE";
  amount: number;
  dayOfMonth: number;
  source: "MANUAL" | "RENT" | "FINANCING";
  description: string;
  startDate: Date;
  endDate?: Date;
  userId: string;
}
