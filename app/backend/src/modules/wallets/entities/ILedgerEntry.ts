export interface ILedgerEntry {
  id: string;
  walletId: string;
  transactionId?: string; // What caused this entry
  type: "CREDIT" | "DEBIT";
  amount: number;
  description: string;
  createdAt: Date;
}
