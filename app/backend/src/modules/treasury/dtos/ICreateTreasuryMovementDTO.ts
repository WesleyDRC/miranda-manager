import { MovementType } from "@/modules/treasury/entities/ITreasuryMovement";

export interface ICreateTreasuryMovementDTO {
  treasuryId: string;
  movementType: MovementType;
  amount: number;
  movementDate: Date | string;
  description: string;
  fixedRate?: number;
  indexerRate?: number;
  annualRate?: number;
}
