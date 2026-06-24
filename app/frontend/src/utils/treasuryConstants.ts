export const TREASURY_CONSTANTS = {
  JUROS_SEMESTRAIS_IDENTIFIER: "JUROS_SEMESTRAIS",
};

export const TreasuryCalendarRules = {
  getCouponMonths: (type: string, matDate: Date): number[] => {
    if (!type.includes("JUROS")) return [];
    if (type.includes("PREFIXADO")) return [0, 6]; // Jan, Jul
    if (type.includes("IPCA")) {
      if (matDate.getFullYear() % 2 === 0) return [1, 7]; // Feb, Aug
      return [4, 10]; // May, Nov
    }
    return [];
  }
};
