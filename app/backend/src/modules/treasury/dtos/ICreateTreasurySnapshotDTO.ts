export interface ICreateTreasurySnapshotDTO {
  treasuryId: string;
  snapshotDate: Date | string;
  currentValue: number;
  projectedValue: number;
}
