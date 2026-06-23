import { injectable } from "tsyringe";
import { IPatrimony } from "@/modules/patrimony/entities/IPatrimony";

@injectable()
export class EquityProjectionCalculator {
  
  public calculateRemainingDebt(financedPatrimonies: IPatrimony[], today: Date, monthOffset: number): number {
    let debt = 0;
    financedPatrimonies.forEach(pat => {
      if (pat.financingDetails?.endDate) {
        const end = new Date(pat.financingDetails.endDate);
        const installmentsLeft = (end.getUTCFullYear() - today.getFullYear()) * 12 + (end.getUTCMonth() - today.getMonth()) - monthOffset;
        if (installmentsLeft > 0) {
          debt += installmentsLeft * pat.financingDetails!.installmentValue;
        }
      }
    });
    return debt;
  }

  public calculateMaxMonths(financedPatrimonies: IPatrimony[], today: Date, investments: any[], simulationPeriod?: string): number {
    if (simulationPeriod === "12_MONTHS") return 12;
    if (simulationPeriod === "24_MONTHS") return 24;
    
    let max = 12;
    for (const pat of financedPatrimonies) {
      if (pat.financingDetails?.endDate) {
        const end = new Date(pat.financingDetails.endDate);
        const diff = (end.getUTCFullYear() - today.getFullYear()) * 12 + (end.getUTCMonth() - today.getMonth());
        if (diff > max) max = diff;
      }
    }
    
    if (simulationPeriod === "UNTIL_MATURITY") {
      for (const inv of investments) {
        if (inv.maturityDate) {
          const end = new Date(inv.maturityDate);
          const diff = (end.getUTCFullYear() - today.getFullYear()) * 12 + (end.getUTCMonth() - today.getMonth());
          if (diff > max) max = diff;
        }
      }
    }
    
    return max;
  }
}
