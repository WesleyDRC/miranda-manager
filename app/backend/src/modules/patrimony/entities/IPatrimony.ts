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
    ipvaHistory?: {
      year: number;
      value: number;
      paid: boolean;
      receiptUrl?: string;
    }[];
    insuranceHistory?: {
      year: number;
      value: number;
      policyUrl?: string;
    }[];
  };
  realEstateDetails?: {
    imageUrl?: string;
  };
  userId: string;
  createdAt?: Date;
  updatedAt?: Date;
}
