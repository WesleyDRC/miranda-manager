import { IRentExpense } from "@/modules/rent/entities/IRentExpense";

interface IRentMonth {
  dateMonth: string;
  paid: boolean;
  expenses?: IRentExpense[];
}

export interface IRent {
  id: string;
  tenant: string;
  value: string;
  street: string;
  streetNumber: string;
  startRental: string;
  status?: string;
  financeName?: string;
  months?: IRentMonth[];
  grossIncome: number;
  netIncome: number;
  userId: string;
  totalExpected?: number;
  totalPaid?: number;
  totalDebt?: number;
  isDebtFree?: boolean;
  observations?: string;
  fixedExpenses?: { reason: string; amount: number }[];
}
