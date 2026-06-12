export interface ITransaction {
  id: string;
  type: "INCOME" | "EXPENSE";
  amount: number;
  dueDate: Date;
  isPaid: boolean;
  isRecurring: boolean;
  source: "MANUAL" | "RENT" | "FINANCING";
  description: string;
  walletId?: string; // If paid, which wallet did it come from/go to
  patrimonyId?: string; // If source=FINANCING, which patrimony is this for
  recurrenceRuleId?: string; // Reference to the rule that generated this
  ruleEndDate?: Date;
  userId: string;
}
