import { injectable } from "tsyringe";

export interface IBailoutResult {
  treasuryWithdrawals: number;
  incomes: number;
  projectedBalance: number;
}

@injectable()
export class AutoBailoutStrategy {
  
  public execute(
    projectedBalance: number, 
    activeInvestments: any[], 
    detailedTransactions: any[], 
    autoRescues: any[], 
    dateStr: string,
    monthIndex: number
  ): IBailoutResult {
    let treasuryWithdrawals = 0;
    let incomes = 0;
    let currentBalance = projectedBalance;

    if (currentBalance < 0) {
      let deficit = Math.abs(currentBalance);
      let liquidTreasuries = activeInvestments.filter((inv: any) => inv.projectedValue > 0);
      
      liquidTreasuries.sort((a: any, b: any) => {
        if (a.treasuryType.includes("SELIC") && !b.treasuryType.includes("SELIC")) return -1;
        if (!a.treasuryType.includes("SELIC") && b.treasuryType.includes("SELIC")) return 1;
        return a.projectedValue - b.projectedValue;
      });

      for (let inv of liquidTreasuries) {
        if (deficit <= 0.01) break;
        let withdrawAmount = Math.min(inv.projectedValue, deficit);
        
        inv.projectedValue -= withdrawAmount;
        inv.projectedInvestedAmount = Math.max(0, inv.projectedInvestedAmount - withdrawAmount);
        
        treasuryWithdrawals += withdrawAmount;
        incomes += withdrawAmount;
        currentBalance += withdrawAmount;
        deficit -= withdrawAmount;
        
        detailedTransactions.push({ 
          id: `auto-rescue-${inv.id}-${monthIndex}`, 
          type: "INCOME", 
          source: `🚨 Resgate Automático: ${inv.titleName}`, 
          amount: withdrawAmount, 
          day: 28 
        });

        autoRescues.push({
          date: dateStr,
          amount: withdrawAmount,
          titleName: inv.titleName
        });
      }
    }

    return { treasuryWithdrawals, incomes, projectedBalance: currentBalance };
  }
}
