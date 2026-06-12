export interface IRecurrenceRule {
  id: string;
  type: "INCOME" | "EXPENSE";
  amount: number;
  dayOfMonth: number; // Day of the month to generate the transaction
  source: "MANUAL" | "RENT" | "FINANCING";
  description: string;
  startDate: Date;
  endDate?: Date;
  userId: string;
}
