import { inject, injectable } from "tsyringe";
import { TaxCalculationService } from "@/modules/treasury/services/TaxCalculationService";
import { ITreasuryInvestment } from "@/modules/treasury/entities/ITreasuryInvestment";
import { ITreasuryMovement } from "@/modules/treasury/entities/ITreasuryMovement";

export interface ITreasuryCalculationResult {
  treasuryYield: number;
  treasuryDeposits: number;
  treasuryWithdrawals: number;
  netProjectedTreasuryValue: number;
}

@injectable()
export class TreasuryProjectionCalculator {
  constructor(
    @inject("TaxCalculationService")
    private taxCalculationService: TaxCalculationService
  ) {}

  public calculateCurrentNetValue(investments: ITreasuryInvestment[], today: Date): number {
    return investments.reduce((acc, inv) => {
      const taxes = this.taxCalculationService.execute(
        Math.max(0, inv.investedAmount), 
        Math.max(0, inv.currentValue), 
        inv.purchaseDate, 
        inv.treasuryType, 
        today
      );
      return acc + taxes.netValue;
    }, 0);
  }

  public processFutureMonth(
    activeInvestments: any[], 
    allMovements: ITreasuryMovement[], 
    targetDate: Date, 
    detailedTransactions: any[],
    investmentScenario?: string
  ): ITreasuryCalculationResult {
    let treasuryYield = 0;
    let treasuryDeposits = 0;
    let treasuryWithdrawals = 0;
    let netProjectedTreasuryValue = 0;

    activeInvestments.forEach((inv: any) => {
      let rate = inv.monthlyEstimatedRate || 0;
      if (investmentScenario === "CONSERVATIVE") rate *= 0.8;
      if (investmentScenario === "OPTIMISTIC") rate *= 1.2;
      
      let monthYield = inv.projectedValue * rate;
      treasuryYield += monthYield;
      inv.projectedValue += monthYield;
      
      if (monthYield > 0) {
        detailedTransactions.push({ id: `treasury-yield-${inv.id}-${targetDate.getMonth()}`, type: "YIELD", source: `Rendimento: ${inv.titleName}`, amount: monthYield, day: 30 });
      }

      const moves = allMovements.filter((m: ITreasuryMovement) => {
        const d = new Date(m.movementDate);
        return m.treasuryId === inv.id && d.getMonth() === targetDate.getMonth() && d.getFullYear() === targetDate.getFullYear();
      });

      moves.forEach((m: ITreasuryMovement) => {
        if (m.movementType === "DEPOSIT") {
          treasuryDeposits += m.amount;
          inv.projectedValue += m.amount;
          inv.projectedInvestedAmount += m.amount;
          detailedTransactions.push({ id: `treasury-dep-${m.id}`, type: "EXPENSE", source: `Aporte: ${inv.titleName}`, amount: m.amount, day: new Date(m.movementDate).getDate() });
        } else if (m.movementType === "WITHDRAW") {
          treasuryWithdrawals += m.amount;
          inv.projectedValue = Math.max(0, inv.projectedValue - m.amount);
          inv.projectedInvestedAmount = Math.max(0, inv.projectedInvestedAmount - m.amount);
          detailedTransactions.push({ id: `treasury-wit-${m.id}`, type: "INCOME", source: `Resgate: ${inv.titleName}`, amount: m.amount, day: new Date(m.movementDate).getDate() });
        }
      });
      
      const purchase = new Date(inv.purchaseDate);
      if (targetDate >= new Date(purchase.getFullYear(), purchase.getMonth(), 1)) {
        const taxes = this.taxCalculationService.execute(Math.max(0, inv.projectedInvestedAmount), Math.max(0, inv.projectedValue), inv.purchaseDate, inv.treasuryType, targetDate);
        netProjectedTreasuryValue += taxes.netValue;
      }
    });

    return { treasuryYield, treasuryDeposits, treasuryWithdrawals, netProjectedTreasuryValue };
  }

  public recalculateNetValueAfterBailout(activeInvestments: any[], targetDate: Date): number {
    let netProjectedTreasuryValue = 0;
    activeInvestments.forEach((inv: any) => {
      const purchase = new Date(inv.purchaseDate);
      if (targetDate >= new Date(purchase.getFullYear(), purchase.getMonth(), 1)) {
        const taxes = this.taxCalculationService.execute(Math.max(0, inv.projectedInvestedAmount), Math.max(0, inv.projectedValue), inv.purchaseDate, inv.treasuryType, targetDate);
        netProjectedTreasuryValue += taxes.netValue;
      }
    });
    return netProjectedTreasuryValue;
  }
}
