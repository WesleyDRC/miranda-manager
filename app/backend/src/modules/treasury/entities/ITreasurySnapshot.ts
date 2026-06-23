export interface ITreasurySnapshot {
  id: string;
  treasuryId: string;
  snapshotDate: Date;
  currentValue: number;
  projectedValue: number;
  createdAt: Date;
}
