import { ICreateTreasuryInvestmentDTO } from "@/modules/treasury/dtos/ICreateTreasuryInvestmentDTO";
import { ITreasuryInvestment } from "@/modules/treasury/entities/ITreasuryInvestment";

export interface ITreasuryInvestmentRepository {
  create(data: ICreateTreasuryInvestmentDTO & {
    currentValue: number;
    projectedValue: number;
    monthlyEstimatedRate: number;
    marketValue?: number;
  }): Promise<ITreasuryInvestment>;
  findByUserId(userId: string): Promise<ITreasuryInvestment[]>;
  findById(id: string): Promise<ITreasuryInvestment | null>;
  update(id: string, data: Partial<ITreasuryInvestment>): Promise<ITreasuryInvestment>;
  delete(id: string): Promise<void>;
}
