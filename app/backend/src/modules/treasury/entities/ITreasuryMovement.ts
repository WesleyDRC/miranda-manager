export type MovementType = "DEPOSIT" | "WITHDRAW" | "ADJUSTMENT";

export interface ITreasuryMovement {
  id: string;
  treasuryId: string;
  movementType: MovementType;
  amount: number;
  movementDate: Date;
  description: string;
  createdAt: Date;
}
