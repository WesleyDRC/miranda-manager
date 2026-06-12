export interface ICreatePatrimonyDTO {
  name: string;
  type: "VEHICLE" | "REAL_ESTATE" | "OTHER";
  marketValue: number;
  isFinanced: boolean;
  financingDetails?: {
    installmentValue: number;
    startDate: Date | string;
    endDate: Date | string;
    dueDateDay: number;
  };
  userId: string;
}
