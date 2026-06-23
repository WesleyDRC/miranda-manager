import { inject, injectable } from "tsyringe";
import { TreasuryProjectionCalculator } from "./TreasuryProjectionCalculator";
import { EquityProjectionCalculator } from "./EquityProjectionCalculator";
import { AutoBailoutStrategy } from "./AutoBailoutStrategy";
import { IForecastContextData } from "./ForecastDataFetcher";
import { ITransaction } from "@/modules/transactions/entities/ITransaction";
import { IPatrimony } from "@/modules/patrimony/entities/IPatrimony";

export interface IForecastOptions {
  simulateScenario?: "LOSS_JOB" | "SELL_CAR" | "NEW_BABY";
  investmentScenario?: "CONSERVATIVE" | "MODERATE" | "OPTIMISTIC";
  simulationPeriod?: "12_MONTHS" | "24_MONTHS" | "UNTIL_MATURITY";
}

@injectable()
export class TimelineBuilder {
  constructor(
    @inject("TreasuryProjectionCalculator")
    private treasuryProjectionCalculator: TreasuryProjectionCalculator,
    @inject("EquityProjectionCalculator")
    private equityProjectionCalculator: EquityProjectionCalculator,
    @inject("AutoBailoutStrategy")
    private autoBailoutStrategy: AutoBailoutStrategy
  ) {}

  public build(data: IForecastContextData, options: IForecastOptions, today: Date) {
    const { simulateScenario, investmentScenario, simulationPeriod } = options;
    const { currentBalance, transactions, patrimonies, financedPatrimonies, bailoutAssets, totalMarketValue, rents, totalRentIncome, investments, allMovements } = data;

    const currentTreasuryValue = this.treasuryProjectionCalculator.calculateCurrentNetValue(investments, today);
    const maxMonths = this.equityProjectionCalculator.calculateMaxMonths(financedPatrimonies, today, investments, simulationPeriod);
    const currentRemainingDebt = this.equityProjectionCalculator.calculateRemainingDebt(financedPatrimonies, today, 0);
    const currentEquity = currentBalance + totalMarketValue + currentTreasuryValue - currentRemainingDebt;

    investments.forEach(inv => {
      bailoutAssets.push({
         name: `Tesouro Direto (${inv.titleName})`,
         marketValue: inv.currentValue,
         isTreasury: true,
         treasuryId: inv.id,
      } as any);
    });

    const timeline: any[] = [];
    const oldestDate = this.findOldestDate(transactions, patrimonies, today);
    const monthsPassed = (today.getFullYear() - oldestDate.getFullYear()) * 12 + (today.getMonth() - oldestDate.getMonth());

    let backwardsBalance = currentBalance;
    this.buildPastTimeline(timeline, monthsPassed, today, data, backwardsBalance);

    const futureResult = this.buildFutureTimeline(maxMonths, options, today, data, currentBalance, bailoutAssets);
    timeline.push(...futureResult.timeline);

    return {
      currentBalance,
      currentEquity,
      projectionMonths: maxMonths,
      bankruptMonthIndex: futureResult.bankruptMonthIndex,
      bankruptDate: futureResult.bankruptDate,
      projectedDebt: futureResult.projectedDebt,
      bailoutPlan: futureResult.bailoutPlan,
      autoRescues: futureResult.autoRescues,
      timeline,
    };
  }

  private findOldestDate(transactions: ITransaction[], patrimonies: IPatrimony[], today: Date): Date {
    let oldest = new Date(today.getFullYear(), today.getMonth(), 1);
    transactions.forEach(tx => {
      const txDate = new Date(tx.dueDate);
      if (txDate < oldest) oldest = new Date(txDate.getFullYear(), txDate.getMonth(), 1);
    });
    patrimonies.forEach(pat => {
      const patDate = new Date(pat.createdAt || today);
      if (patDate < oldest) oldest = new Date(patDate.getFullYear(), patDate.getMonth(), 1);
      if (pat.financingDetails?.startDate) {
        const start = new Date(pat.financingDetails.startDate);
        if (start < oldest) oldest = new Date(start.getFullYear(), start.getMonth(), 1);
      }
    });
    return oldest;
  }

  private buildPastTimeline(timeline: any[], monthsPassed: number, today: Date, data: IForecastContextData, backwardsBalance: number) {
    const { transactions, financedPatrimonies, totalMarketValue, rents, investments, allMovements } = data;

    let activeBackwardsInvestments = investments.map(inv => ({
      ...inv,
      backwardsValue: inv.currentValue,
      backwardsInvestedAmount: inv.investedAmount
    }));

    for (let i = 0; i >= -monthsPassed; i--) {
      const targetDate = new Date(today.getFullYear(), today.getMonth() + i, 1);
      const targetMonth = targetDate.getMonth();
      const targetYear = targetDate.getFullYear();

      let incomes = 0, expenses = 0, pastRent = 0, pastSalary = 0, pastFixed = 0, pastPatrimony = 0;
      const detailedTransactions: any[] = [];

      rents.forEach((r: any) => {
        let isAfterStart = true;
        if (r.startRental) {
          const parts = r.startRental.split('/');
          if (parts.length === 3) {
            const startYear = parseInt(parts[2], 10);
            const startMonth = parseInt(parts[1], 10) - 1;
            if (targetYear < startYear || (targetYear === startYear && targetMonth < startMonth)) {
              isAfterStart = false;
            }
          }
        }
        if (isAfterStart) {
          const hasTransaction = transactions.some(tx => {
            const txDate = new Date(tx.dueDate);
            return tx.type === "INCOME" &&
                   txDate.getMonth() === targetMonth &&
                   txDate.getFullYear() === targetYear &&
                   ((tx.source || tx.description || "").includes(r.tenant) || tx.source === "RENT");
          });

          if (!hasTransaction) {
            detailedTransactions.push({ id: `rent-past-${r.id}-${i}`, type: "INCOME", source: `Aluguel: ${r.tenant}`, amount: Number(r.value), day: 10 });
            incomes += Number(r.value);
            pastRent += Number(r.value);
          }
        }
      });

      transactions.forEach(tx => {
        const txDate = new Date(tx.dueDate);
        if (txDate.getMonth() === targetMonth && txDate.getFullYear() === targetYear) {
          detailedTransactions.push({
            id: tx.id, type: tx.type,
            source: tx.source === "FINANCING" ? tx.description : (tx.description || tx.source),
            amount: tx.amount, day: txDate.getDate()
          });
          if (tx.type === "INCOME") {
            incomes += tx.amount;
            if (tx.source === "RENT") pastRent += tx.amount;
            else pastSalary += tx.amount;
          } else {
            expenses += tx.amount;
            if (tx.source === "FINANCING" || tx.patrimonyId) pastPatrimony += tx.amount;
            else pastFixed += tx.amount;
          }
        }
      });

      let pastTreasuryValue = 0;
      let pastTreasuryYield = 0;
      let pastTreasuryDeposits = 0;
      let pastTreasuryWithdrawals = 0;

      activeBackwardsInvestments.forEach((inv: any) => {
        const moves = allMovements.filter(m => {
          const d = new Date(m.movementDate);
          return m.treasuryId === inv.id && d.getUTCMonth() === targetMonth && d.getUTCFullYear() === targetYear;
        });

        moves.forEach(m => {
          if (m.movementType === "DEPOSIT") {
            inv.backwardsValue -= m.amount;
            inv.backwardsInvestedAmount -= m.amount;
            detailedTransactions.push({ id: `treasury-dep-past-${m.id}`, type: "EXPENSE", source: `Aporte: ${inv.titleName}`, amount: m.amount, day: new Date(m.movementDate).getDate() });
            expenses += m.amount;
            pastTreasuryDeposits += m.amount;
          } else if (m.movementType === "WITHDRAW") {
            inv.backwardsValue += m.amount;
            inv.backwardsInvestedAmount += m.amount;
            detailedTransactions.push({ id: `treasury-wit-past-${m.id}`, type: "INCOME", source: `Resgate: ${inv.titleName}`, amount: m.amount, day: new Date(m.movementDate).getDate() });
            incomes += m.amount;
            pastTreasuryWithdrawals += m.amount;
          }
        });

        const rate = inv.monthlyEstimatedRate || 0;
        const previousValue = inv.backwardsValue / (1 + rate);
        const pastYield = inv.backwardsValue - previousValue;
        pastTreasuryYield += pastYield;
        inv.backwardsValue = previousValue;
        
        if (pastYield > 0) {
          detailedTransactions.push({ id: `treasury-yield-past-${inv.id}-${i}`, type: "YIELD", source: `Rendimento: ${inv.titleName}`, amount: pastYield, day: 30 });
        }

        if (inv.backwardsValue < 0) inv.backwardsValue = 0;
        
        const purchase = new Date(inv.purchaseDate);
        if (targetDate >= new Date(purchase.getFullYear(), purchase.getMonth(), 1)) {
          const taxes = this.treasuryProjectionCalculator["taxCalculationService"].execute(Math.max(0, inv.backwardsInvestedAmount), inv.backwardsValue, inv.purchaseDate, inv.treasuryType, targetDate);
          pastTreasuryValue += taxes.netValue;
        }
      });

      let remainingDebt = this.equityProjectionCalculator.calculateRemainingDebt(financedPatrimonies, today, i);
      let projectedEquity = backwardsBalance + totalMarketValue + pastTreasuryValue - remainingDebt;

      let investmentsState = activeBackwardsInvestments.map(inv => ({
        id: inv.id,
        name: inv.titleName,
        balance: inv.backwardsValue
      }));

      timeline.unshift({
        monthIndex: i, date: `${targetMonth + 1}/${targetYear}`,
        projectedBalance: backwardsBalance, projectedEquity,
        incomes, expenses, detailedTransactions,
        investmentsState,
        composition: { rentIncomes: pastRent, salaryIncomes: pastSalary, fixedExpenses: pastFixed, patrimonyInstallments: pastPatrimony, treasuryYield: pastTreasuryYield, treasuryDeposits: pastTreasuryDeposits, treasuryWithdrawals: pastTreasuryWithdrawals, treasuryBalance: pastTreasuryValue }
      });
      backwardsBalance = backwardsBalance - incomes + expenses;
    }
  }

  private buildFutureTimeline(maxMonths: number, options: IForecastOptions, today: Date, data: IForecastContextData, currentBalance: number, bailoutAssets: any[]) {
    const { simulateScenario, investmentScenario } = options;
    const { totalRentIncome, rents, transactions, financedPatrimonies, totalMarketValue, investments, allMovements } = data;
    
    let projectedBalance = currentBalance;
    let bankruptMonthIndex = null, bankruptDate = null, projectedDebt = null, bailoutPlan = null;
    let autoRescues: any[] = [];
    
    let activeInvestments = investments.map(inv => ({
      ...inv,
      projectedValue: inv.currentValue,
      projectedInvestedAmount: inv.investedAmount
    }));
    const timeline = [];

    for (let i = 1; i <= maxMonths; i++) {
      let rentIncomes = totalRentIncome, salaryIncomes = 0, fixedExpenses = 0, patrimonyInstallments = 0;
      const detailedTransactions: any[] = [];
      const targetDate = new Date(today.getFullYear(), today.getMonth() + i, 1);

      if (simulateScenario === "SELL_CAR" && i === 1) {
        salaryIncomes += 50000;
        detailedTransactions.push({ id: "sim-sell", type: "INCOME", source: "Venda Veículo", amount: 50000, day: 1 });
      }
      if (simulateScenario === "NEW_BABY" && i >= 1) {
        fixedExpenses += 3000;
        detailedTransactions.push({ id: `sim-baby-${i}`, type: "EXPENSE", source: "Bebê", amount: 3000, day: 5 });
      }

      rents.forEach((r: any) => detailedTransactions.push({ id: `rent-${r.id}-${i}`, type: "INCOME", source: `Aluguel: ${r.tenant}`, amount: Number(r.value), day: 10 }));

      transactions.forEach(tx => {
        if (!tx.isPaid) {
          const txDate = new Date(tx.dueDate);
          if (txDate.getMonth() === targetDate.getMonth() && txDate.getFullYear() === targetDate.getFullYear()) {
            detailedTransactions.push({
              id: tx.id, type: tx.type, source: tx.source === "FINANCING" ? tx.description : (tx.description || tx.source), amount: tx.amount, day: txDate.getDate()
            });
            if (tx.type === "INCOME") {
              if (simulateScenario === "LOSS_JOB" && tx.isRecurring) {
                detailedTransactions[detailedTransactions.length - 1].source += " [DEMITIDO]";
                detailedTransactions[detailedTransactions.length - 1].amount = 0;
              } else {
                salaryIncomes += tx.amount;
              }
            } else {
              if (tx.source === "FINANCING" || tx.patrimonyId) patrimonyInstallments += tx.amount;
              else fixedExpenses += tx.amount;
            }
          }
        }
      });

      const { treasuryYield, treasuryDeposits, treasuryWithdrawals, netProjectedTreasuryValue: initialNetValue } = this.treasuryProjectionCalculator.processFutureMonth(
        activeInvestments, allMovements, targetDate, detailedTransactions, investmentScenario
      );

      activeInvestments.forEach((inv: any) => {
         let bailoutObj = bailoutAssets.find((b: any) => b.treasuryId === inv.id);
         if (bailoutObj) bailoutObj.marketValue = inv.projectedValue;
      });

      let remainingDebt = this.equityProjectionCalculator.calculateRemainingDebt(financedPatrimonies, today, i);
      let incomes = rentIncomes + salaryIncomes + treasuryWithdrawals;
      let expenses = fixedExpenses + patrimonyInstallments + treasuryDeposits;
      projectedBalance = projectedBalance + incomes - expenses;
      
      const dateStr = `${targetDate.getUTCMonth() + 1}/${targetDate.getUTCFullYear()}`;

      // Auto Bailout Logic
      const bailoutResult = this.autoBailoutStrategy.execute(projectedBalance, activeInvestments, detailedTransactions, autoRescues, dateStr, i);
      projectedBalance = bailoutResult.projectedBalance;
      incomes += bailoutResult.incomes;
      
      let netProjectedTreasuryValue = initialNetValue;
      if (bailoutResult.treasuryWithdrawals > 0) {
        netProjectedTreasuryValue = this.treasuryProjectionCalculator.recalculateNetValueAfterBailout(activeInvestments, targetDate);
      }

      let projectedEquity = projectedBalance + totalMarketValue + netProjectedTreasuryValue - remainingDebt;

      let investmentsState = activeInvestments.map((inv: any) => ({
        id: inv.id,
        name: inv.titleName,
        balance: inv.projectedValue
      }));

      timeline.push({
        monthIndex: i, date: dateStr, projectedBalance, projectedEquity, incomes, expenses, detailedTransactions,
        investmentsState,
        composition: { rentIncomes, salaryIncomes, fixedExpenses, patrimonyInstallments, treasuryYield, treasuryDeposits, treasuryWithdrawals: treasuryWithdrawals + bailoutResult.treasuryWithdrawals, treasuryBalance: netProjectedTreasuryValue }
      });

      if (projectedBalance < 0 && bankruptMonthIndex === null) {
        bankruptMonthIndex = i; bankruptDate = dateStr; projectedDebt = projectedBalance;
        const deficit = Math.abs(projectedBalance);
        let selectedBailout = bailoutAssets.find((a: any) => a.marketValue >= deficit);
        if (selectedBailout) bailoutPlan = `Você ficará negativo em ${dateStr}. Recomendação: Vender [${selectedBailout.name}] por R$ ${selectedBailout.marketValue}.`;
        else bailoutPlan = `Ficará negativo em ${dateStr}. Nenhum bem suficiente. Deficit: R$ ${deficit}.`;
      }
    }
    return { timeline, bankruptMonthIndex, bankruptDate, projectedDebt, bailoutPlan, autoRescues };
  }
}
