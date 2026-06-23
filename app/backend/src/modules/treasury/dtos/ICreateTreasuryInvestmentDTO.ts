import { TreasuryType } from "@/modules/treasury/entities/ITreasuryInvestment";

export interface ICreateTreasuryInvestmentDTO {
  userId: string;
  treasuryType: TreasuryType;
  titleName: string;
  purchaseDate: Date | string;
  maturityDate: Date | string;
  investedAmount: number;
  annualRate: number;
  liquidityAvailable?: boolean;
  quantity?: number;
  unitPrice?: number;
  marketUnitPrice?: number;
  notes?: string;
}
