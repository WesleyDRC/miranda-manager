import { treasuryConstants } from "@/modules/treasury/constants/treasuryConstants";

/**
 * Service responsible for official B3 calendar rules and domain rules
 * for Tesouro Direto coupon payouts and maturity dates.
 * Adheres to Single Responsibility Principle (SRP) by isolating date rules.
 */
export class TreasuryCalendarService {
  /**
   * Returns the months (0-indexed) in which coupons are paid for a given treasury type and maturity date.
   */
  static getCouponMonths(treasuryType: string, maturityDate: Date | string): number[] {
    if (!treasuryType.includes("JUROS")) return [];
    if (treasuryType.includes("PREFIXADO")) return [0, 6]; // Jan (0) and Jul (6)
    if (treasuryType.includes("IPCA")) {
        const year = new Date(maturityDate).getFullYear();
        if (year % 2 === 0) return [1, 7]; // Feb (1) and Aug (7)
        return [4, 10]; // May (4) and Nov (10)
    }
    return [];
  }

  static isCouponMonth(date: Date | string, treasuryType: string, maturityDate: Date | string): boolean {
    const couponMonths = TreasuryCalendarService.getCouponMonths(treasuryType, maturityDate);
    return couponMonths.includes(new Date(date).getMonth());
  }

  static getCouponDatesBetween(purchaseDate: Date | string, referenceDate: Date | string, treasuryType: string, maturityDate: Date | string): Date[] {
    const dates: Date[] = [];
    if (!treasuryType.includes("JUROS")) return dates;
    
    const isPrefixado = treasuryType.includes("PREFIXADO");
    const isIpca = treasuryType.includes("IPCA");
    const matYear = new Date(maturityDate).getFullYear();
    const isEven = matYear % 2 === 0;
    
    const pDate = new Date(purchaseDate);
    const rDate = new Date(referenceDate);

    let iter = new Date(pDate.getFullYear(), pDate.getMonth(), 1);
    
    while (iter <= rDate) {
        const m = iter.getMonth();
        let couponDate: Date | null = null;
        
        if (isPrefixado && (m === 0 || m === 6)) couponDate = new Date(iter.getFullYear(), m, 1);
        else if (isIpca && isEven && (m === 1 || m === 7)) couponDate = new Date(iter.getFullYear(), m, 15);
        else if (isIpca && !isEven && (m === 4 || m === 10)) couponDate = new Date(iter.getFullYear(), m, 15);
        
        if (couponDate && couponDate.getTime() > pDate.getTime() && couponDate.getTime() <= rDate.getTime()) {
            dates.push(couponDate);
        }
        
        iter.setMonth(iter.getMonth() + 1);
    }
    return dates;
  }

  static getLastResetDate(purchaseDate: Date | string, referenceDate: Date | string, treasuryType: string, maturityDate: Date | string): Date {
    const dates = TreasuryCalendarService.getCouponDatesBetween(purchaseDate, referenceDate, treasuryType, maturityDate);
    return dates.length > 0 ? dates[dates.length - 1] : new Date(purchaseDate);
  }
}
