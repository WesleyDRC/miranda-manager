export interface ICreateTransactionDTO {
  type: "INCOME" | "EXPENSE";
  amount: number;
  dueDate: Date;
  isPaid?: boolean;
  isRecurring?: boolean;
  source?: "MANUAL" | "RENT" | "FINANCING";
  description: string;
  walletId?: string;
  patrimonyId?: string;
  recurrenceRuleId?: string;
  userId: string;
  endDate?: Date;
}
