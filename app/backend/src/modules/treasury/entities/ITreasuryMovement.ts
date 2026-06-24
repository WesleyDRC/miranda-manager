export type MovementType = "DEPOSIT" | "WITHDRAW" | "ADJUSTMENT";

export interface ITreasuryMovement {
  id: string;
  treasuryId: string;
  movementType: MovementType;
  amount: number;
  movementDate: Date;
  description: string;
  fixedRate?: number;
  indexerRate?: number;
  annualRate?: number;
  createdAt: Date;
}
