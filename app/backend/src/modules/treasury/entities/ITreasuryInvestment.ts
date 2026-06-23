export type TreasuryType =
  | "SELIC"
  | "PREFIXADO"
  | "PREFIXADO_JUROS"
  | "IPCA"
  | "IPCA_JUROS";

export interface ITreasuryInvestment {
  id: string;
  userId: string;
  treasuryType: TreasuryType;
  titleName: string;
  purchaseDate: Date;
  maturityDate: Date;
  investedAmount: number;
  currentValue: number;
  projectedValue: number;
  annualRate: number;
  monthlyEstimatedRate: number;
  quantity?: number;
  unitPrice?: number; // Preço na Aplicação (PU de Compra)
  marketUnitPrice?: number; // Preço Unitário Atual (PU Atual de Mercado)
  marketValue?: number; // Valor a Mercado (quantity * marketUnitPrice)
  liquidityAvailable: boolean;
  notes?: string;
  taxes?: any;
  createdAt: Date;
  updatedAt: Date;
}
