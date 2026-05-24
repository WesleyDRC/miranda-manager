export interface IRentPayment {
  id: string;
  amount: number;
  paymentDate: Date;
  rentMonthId: string;
  userId: string;
}
