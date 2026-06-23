import { injectable } from "tsyringe";

interface ITaxCalculationResult {
  days: number;
  profit: number;
  iofTax: number;
  irRate: number;
  irTax: number;
  b3Tax: number;
  netValue: number;
}

@injectable()
export class TaxCalculationService {
  public execute(
    investedAmount: number,
    grossValue: number,
    purchaseDate: string | Date,
    treasuryType: string,
    targetDate: Date = new Date()
  ): ITaxCalculationResult {
    const MS_PER_DAY = 1000 * 60 * 60 * 24;
    const start = new Date(purchaseDate);
    
    // Calcula os dias corridos a partir da data de compra
    const days = Math.floor((targetDate.getTime() - start.getTime()) / MS_PER_DAY);

    // 1. IOF Table (First 30 days)
    const iofTable: { [key: number]: number } = {
      0: 0.96, 1: 0.96, 2: 0.93, 3: 0.90, 4: 0.86, 5: 0.83, 6: 0.80, 7: 0.76, 8: 0.73, 9: 0.70,
      10: 0.66, 11: 0.63, 12: 0.60, 13: 0.56, 14: 0.53, 15: 0.50, 16: 0.46, 17: 0.43, 18: 0.40, 19: 0.36,
      20: 0.33, 21: 0.30, 22: 0.26, 23: 0.23, 24: 0.20, 25: 0.16, 26: 0.13, 27: 0.10, 28: 0.06, 29: 0.03
    };
    
    const profit = Math.max(0, grossValue - investedAmount);
    
    let iofRate = 0;
    if (days >= 0 && days < 30) {
      iofRate = iofTable[days] || 0;
    }
    const iofTax = profit * iofRate;
    
    const profitAfterIof = Math.max(0, profit - iofTax);

    // 2. IR Aliquot
    let irRate = 0.225; // Até 180 dias
    if (days > 180 && days <= 360) irRate = 0.20;
    else if (days > 360 && days <= 720) irRate = 0.175;
    else if (days > 720) irRate = 0.15;

    const irTax = profitAfterIof * irRate;

    // 3. B3 Tax (0.20% a.a.)
    // Aproximação: valor médio * 0.20% * anos corridos
    let b3Tax = 0;
    const years = Math.max(0, days / 365);
    const averageValue = (investedAmount + grossValue) / 2;
    
    if (treasuryType.includes("SELIC")) {
      // Regra de isenção B3 para Tesouro Selic até R$ 10.000,00
      if (averageValue > 10000) {
        b3Tax = (averageValue - 10000) * 0.002 * years;
      }
    } else {
      b3Tax = averageValue * 0.002 * years;
    }

    const netValue = grossValue - iofTax - irTax - b3Tax;

    return {
      days,
      profit,
      iofTax,
      irRate,
      irTax,
      b3Tax,
      netValue
    };
  }
}
