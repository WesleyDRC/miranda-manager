export interface IPatrimony {
  id: string;
  name: string;
  type: "VEHICLE" | "REAL_ESTATE" | "OTHER";
  marketValue: number;
  isFinanced: boolean;
  financingDetails?: {
    installmentValue: number;
    startDate: Date;
    endDate: Date;
    dueDateDay: number;
  };
  vehicleDetails?: {
    plate?: string;
    year?: string;
    ipvaValue?: number;
    ipvaPaid?: boolean;
    insuranceValue?: number;
    imageUrl?: string;
    ipvaReceiptUrl?: string;
    insurancePolicyUrl?: string;
  };
  realEstateDetails?: {
    imageUrl?: string;
  };
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}
