import { inject, injectable } from "tsyringe";
import { IWalletRepository } from "@/modules/wallets/repositories/IWalletRepository";
import { ITransactionRepository } from "@/modules/transactions/repositories/ITransactionRepository";
import { IPatrimonyRepository } from "@/modules/patrimony/repositories/IPatrimonyRepository";
import { IRentRepository } from "@/modules/rent/repositories/IRentRepository";
import { ITransaction } from "@/modules/transactions/entities/ITransaction";
import { IPatrimony } from "@/modules/patrimony/entities/IPatrimony";

interface IForecastResult {
  currentBalance: number;
  currentEquity: number;
  projectionMonths: number;
  bankruptMonthIndex: number | null;
  bankruptDate: string | null;
  projectedDebt: number | null;
  bailoutPlan: string | null;
  timeline: Array<any>;
}

@injectable()
export class ForecastService {
  constructor(
    @inject("WalletRepository")
    private walletRepository: IWalletRepository,
    @inject("TransactionRepository")
    private transactionRepository: ITransactionRepository,
    @inject("PatrimonyRepository")
    private patrimonyRepository: IPatrimonyRepository,
    @inject("RentRepository")
    private rentRepository: IRentRepository
  ) {}

  public async execute(
    userId: string,
    simulateScenario?: "LOSS_JOB" | "SELL_CAR" | "NEW_BABY"
  ): Promise<IForecastResult> {
    const today = new Date();

    // 1. Coletar Saldo Atual
    const wallets = await this.walletRepository.findByUserId(userId);
    const currentBalance = wallets.reduce((acc, wallet) => acc + wallet.balance, 0);

    // 2. Coletar Entradas e Saídas
    const transactions = await this.transactionRepository.findByUserId(userId);

    // 3. Patrimônio Financiado (Despesas) e Resgate
    const patrimonies = await this.patrimonyRepository.findByUserId(userId);
    const financedPatrimonies = patrimonies.filter(p => p.isFinanced && p.financingDetails);
    const bailoutAssets = [...patrimonies].sort((a, b) => a.marketValue - b.marketValue);

    // 4. Receitas de Aluguéis (Incomes)
    const allRents = await this.rentRepository.findAll(userId);
    const rents = allRents.filter((r: any) => r.status !== "finished");
    const totalRentIncome = rents.reduce((acc: number, r: any) => acc + Number(r.value), 0);

    // --- ALGORITMO DE HORIZONTE DINÂMICO ---
    const maxMonths = this.calculateMaxMonths(financedPatrimonies, today);
    let totalMarketValue = patrimonies.reduce((acc, p) => acc + p.marketValue, 0);
    let currentRemainingDebt = this.calculateRemainingDebt(financedPatrimonies, today, 0);
    let currentEquity = currentBalance + totalMarketValue - currentRemainingDebt;

    // --- HISTÓRICO PASSADO ---
    const timeline: any[] = [];
    const oldestDate = this.findOldestDate(transactions, patrimonies, today);
    const monthsPassed = (today.getFullYear() - oldestDate.getFullYear()) * 12 + (today.getMonth() - oldestDate.getMonth());

    let backwardsBalance = currentBalance;
    this.buildPastTimeline(timeline, monthsPassed, today, transactions, financedPatrimonies, totalMarketValue, backwardsBalance, allRents);

    // --- LOOP DE SIMULAÇÃO (Futuro) ---
    const futureResult = this.buildFutureTimeline({
      maxMonths,
      simulateScenario,
      today,
      totalRentIncome,
      rents,
      transactions,
      financedPatrimonies,
      totalMarketValue,
      projectedBalance: currentBalance,
      bailoutAssets
    });

    timeline.push(...futureResult.timeline);

    return {
      currentBalance,
      currentEquity,
      projectionMonths: maxMonths,
      bankruptMonthIndex: futureResult.bankruptMonthIndex,
      bankruptDate: futureResult.bankruptDate,
      projectedDebt: futureResult.projectedDebt,
      bailoutPlan: futureResult.bailoutPlan,
      timeline,
    };
  }

  private calculateMaxMonths(financedPatrimonies: IPatrimony[], today: Date): number {
    let max = 12;
    for (const pat of financedPatrimonies) {
      if (pat.financingDetails?.endDate) {
        const end = new Date(pat.financingDetails.endDate);
        const diff = (end.getUTCFullYear() - today.getFullYear()) * 12 + (end.getUTCMonth() - today.getMonth());
        if (diff > max) max = diff;
      }
    }
    return max;
  }

  private calculateRemainingDebt(financedPatrimonies: IPatrimony[], today: Date, monthOffset: number): number {
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

  private buildPastTimeline(timeline: any[], monthsPassed: number, today: Date, transactions: ITransaction[], financedPatrimonies: IPatrimony[], totalMarketValue: number, backwardsBalance: number, rents: any[]) {
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

      let remainingDebt = this.calculateRemainingDebt(financedPatrimonies, today, i);
      let projectedEquity = backwardsBalance + totalMarketValue - remainingDebt;

      timeline.unshift({
        monthIndex: i, date: `${targetMonth + 1}/${targetYear}`,
        projectedBalance: backwardsBalance, projectedEquity,
        incomes, expenses, detailedTransactions,
        composition: { rentIncomes: pastRent, salaryIncomes: pastSalary, fixedExpenses: pastFixed, patrimonyInstallments: pastPatrimony }
      });
      backwardsBalance = backwardsBalance - incomes + expenses;
    }
  }

  private buildFutureTimeline(params: any) {
    const { maxMonths, simulateScenario, today, totalRentIncome, rents, transactions, financedPatrimonies, totalMarketValue, bailoutAssets } = params;
    let { projectedBalance } = params;

    let bankruptMonthIndex = null, bankruptDate = null, projectedDebt = null, bailoutPlan = null;
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

      let remainingDebt = this.calculateRemainingDebt(financedPatrimonies, today, i);
      let incomes = rentIncomes + salaryIncomes;
      let expenses = fixedExpenses + patrimonyInstallments;
      projectedBalance = projectedBalance + incomes - expenses;
      let projectedEquity = projectedBalance + totalMarketValue - remainingDebt;

      const dateStr = `${targetDate.getMonth() + 1}/${targetDate.getFullYear()}`;
      timeline.push({
        monthIndex: i, date: dateStr, projectedBalance, projectedEquity, incomes, expenses, detailedTransactions,
        composition: { rentIncomes, salaryIncomes, fixedExpenses, patrimonyInstallments }
      });

      if (projectedBalance < 0 && bankruptMonthIndex === null) {
        bankruptMonthIndex = i; bankruptDate = dateStr; projectedDebt = projectedBalance;
        const deficit = Math.abs(projectedBalance);
        let selectedBailout = bailoutAssets.find((a: any) => a.marketValue >= deficit);
        if (selectedBailout) bailoutPlan = `Você ficará negativo em ${dateStr}. Recomendação: Vender [${selectedBailout.name}] por R$ ${selectedBailout.marketValue}.`;
        else bailoutPlan = `Ficará negativo em ${dateStr}. Nenhum bem suficiente. Deficit: R$ ${deficit}.`;
      }
    }
    return { timeline, bankruptMonthIndex, bankruptDate, projectedDebt, bailoutPlan };
  }
}
