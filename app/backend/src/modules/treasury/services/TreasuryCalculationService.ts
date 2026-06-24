import { TreasuryType } from "@/modules/treasury/entities/ITreasuryInvestment";
import { treasuryConstants } from "@/modules/treasury/constants/treasuryConstants";
import { TreasuryCalendarService } from "./TreasuryCalendarService";

/**
 * Service responsible for treasury yield calculations.
 * Converts annual rates to monthly and projects future values
 * using compound interest formulas appropriate for each treasury type.
 * Adheres to SRP by delegating calendar rules to TreasuryCalendarService.
 */
export class TreasuryCalculationService {
  /**
   * Converts an annual rate to an equivalent monthly rate
   * using compound interest: (1 + annual)^(1/12) - 1
   */
  static annualToMonthlyRate(annualRate: number): number {
    return Math.pow(1 + annualRate / 100, 1 / 12) - 1;
  }

  /**
   * Calculates the projected value at maturity using compound interest.
   * For IPCA types, the annualRate should already include the expected IPCA component.
   */
  static calculateProjectedValue(
    investedAmount: number,
    annualRate: number,
    purchaseDate: Date,
    maturityDate: Date,
    treasuryType?: TreasuryType
  ): number {
    const monthlyRate = TreasuryCalculationService.annualToMonthlyRate(annualRate);

    if (treasuryType && treasuryType.includes(treasuryConstants.JUROS_SEMESTRAIS_IDENTIFIER)) {
      const lastReset = TreasuryCalendarService.getLastResetDate(purchaseDate, maturityDate, treasuryType, maturityDate);
      const remainingMonths = TreasuryCalculationService.monthsBetween(lastReset, new Date(maturityDate));
      return investedAmount * Math.pow(1 + monthlyRate, remainingMonths);
    }

    const months = TreasuryCalculationService.monthsBetween(
      new Date(purchaseDate),
      new Date(maturityDate)
    );
    return investedAmount * Math.pow(1 + monthlyRate, months);
  }

  /**
   * Calculates the current value based on elapsed time since purchase.
   * Uses the same compound interest formula but over elapsed months.
   * Se for título com Juros Semestrais, usa o último pagamento oficial.
   */
  static calculateCurrentValue(
    investedAmount: number,
    annualRate: number,
    purchaseDate: Date,
    referenceDate: Date = new Date(),
    treasuryType?: TreasuryType,
    maturityDate?: Date
  ): number {
    const pDate = new Date(purchaseDate);
    const mDate = maturityDate ? new Date(maturityDate) : new Date(pDate.getFullYear() + 10, 0, 1);
    
    if (referenceDate.getTime() >= mDate.getTime()) {
      // If past maturity, we should ideally return 0 (it expired), but to not break existing charts 
      // that query "currentValue" past maturity date without handling it, we return the value AT maturity.
      // Usually, it's better handled explicitly.
      referenceDate = mDate;
    }

    if (treasuryType && treasuryType.includes(treasuryConstants.JUROS_SEMESTRAIS_IDENTIFIER)) {
      const lastReset = TreasuryCalendarService.getLastResetDate(pDate, referenceDate, treasuryType, mDate);
      const remainingMonths = TreasuryCalculationService.monthsBetween(lastReset, referenceDate);
      if (remainingMonths <= 0) return investedAmount;
      const monthlyRate = TreasuryCalculationService.annualToMonthlyRate(annualRate);
      return investedAmount * Math.pow(1 + monthlyRate, remainingMonths);
    }

    const months = TreasuryCalculationService.monthsBetween(pDate, referenceDate);
    if (months <= 0) return investedAmount;
    const monthlyRate = TreasuryCalculationService.annualToMonthlyRate(annualRate);
    return investedAmount * Math.pow(1 + monthlyRate, months);
  }

  /**
   * Calculates the number of months between two dates.
   */
  static monthsBetween(startDate: Date, endDate: Date): number {
    const years = endDate.getFullYear() - startDate.getFullYear();
    const months = endDate.getMonth() - startDate.getMonth();
    const days = endDate.getDate() - startDate.getDate();
    const totalMonths = years * 12 + months;
    // Add fractional month for remaining days
    const daysInMonth = new Date(
      endDate.getFullYear(),
      endDate.getMonth() + 1,
      0
    ).getDate();
    return totalMonths + days / daysInMonth;
  }

  /**
   * Calculates the gross yield (rendimento bruto) for a given investment.
   */
  static calculateGrossYield(investedAmount: number, currentValue: number): number {
    return currentValue - investedAmount;
  }

  /**
   * Calculates income tax (IR) using the regressive table for fixed income.
   * Based on holding period from purchase date to reference date.
   */
  static calculateIncomeTax(
    grossYield: number,
    purchaseDate: Date,
    referenceDate: Date = new Date()
  ): number {
    if (grossYield <= 0) return 0;
    const days = Math.floor(
      (referenceDate.getTime() - new Date(purchaseDate).getTime()) / (1000 * 60 * 60 * 24)
    );
    const rate = TreasuryCalculationService.getIRRate(days);
    return grossYield * rate;
  }

  /**
   * Returns the IR tax rate based on the holding period.
   * Tabela regressiva de IR sobre renda fixa.
   */
  static getIRRate(holdingDays: number): number {
    if (holdingDays <= 180) return 0.225;
    if (holdingDays <= 360) return 0.20;
    if (holdingDays <= 720) return 0.175;
    return 0.15;
  }

  /**
   * Calculates the net value after IR deduction.
   */
  static calculateNetValue(
    investedAmount: number,
    currentValue: number,
    purchaseDate: Date,
    referenceDate: Date = new Date()
  ): number {
    const grossYield = TreasuryCalculationService.calculateGrossYield(investedAmount, currentValue);
    const tax = TreasuryCalculationService.calculateIncomeTax(grossYield, purchaseDate, referenceDate);
    return currentValue - tax;
  }
}
