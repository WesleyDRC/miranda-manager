import { inject, injectable } from "tsyringe";
import { IWalletRepository } from "../../wallets/repositories/IWalletRepository";
import { ITransactionRepository } from "../../transactions/repositories/ITransactionRepository";
import { IPatrimonyRepository } from "../../patrimony/repositories/IPatrimonyRepository";
import { IRentRepository } from "../../rent/repositories/IRentRepository";
import { ITransaction } from "../../transactions/entities/ITransaction";
import { IPatrimony } from "../../patrimony/entities/IPatrimony";

interface IForecastResult {
  currentBalance: number;
  currentEquity: number;
  projectionMonths: number;
  bankruptMonthIndex: number | null;
  bankruptDate: string | null;
  projectedDebt: number | null;
  bailoutPlan: string | null;
  timeline: Array<{
    monthIndex: number;
    date: string;
    projectedBalance: number;
    incomes: number;
    expenses: number;
    composition: {
      rentIncomes: number;
      salaryIncomes: number;
      fixedExpenses: number;
      patrimonyInstallments: number;
    };
  }>;
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
    
    // Ordenar patrimônios pelo menor valor de mercado para o plano de resgate
    const bailoutAssets = [...patrimonies].sort((a, b) => a.marketValue - b.marketValue);

    // 4. Receitas de Aluguéis (Incomes)
    // Assumimos que cada Rent ativo rende o "value" por mês (simplificado para a projeção)
    const rents = await this.rentRepository.findAll(userId);
    const totalRentIncome = rents.reduce((acc: number, r: any) => acc + Number(r.value), 0);

    // --- ALGORITMO DE HORIZONTE DINÂMICO ---
    let maxMonths = 12; // Mínimo de 12 meses
    for (const pat of financedPatrimonies) {
      if (pat.financingDetails && pat.financingDetails.endDate) {
        const end = new Date(pat.financingDetails.endDate);
        const diff = (end.getUTCFullYear() - today.getFullYear()) * 12 + (end.getUTCMonth() - today.getMonth());
        if (diff > maxMonths) {
          maxMonths = diff;
        }
      }
    }

    // --- LOOP DE SIMULAÇÃO ---
    let projectedBalance = currentBalance;
    let bankruptMonthIndex: number | null = null;
    let bankruptDate: string | null = null;
    let projectedDebt: number | null = null;
    let bailoutPlan: string | null = null;
    
    // Calcular Total Market Value (para o Equity inicial)
    let totalMarketValue = patrimonies.reduce((acc, p) => acc + p.marketValue, 0);

    let currentRemainingDebt = 0;
    financedPatrimonies.forEach(pat => {
      if (pat.financingDetails && pat.financingDetails.endDate) {
        const end = new Date(pat.financingDetails.endDate);
        const installmentsLeft = (end.getUTCFullYear() - today.getFullYear()) * 12 + (end.getUTCMonth() - today.getMonth());
        if (installmentsLeft > 0) {
          currentRemainingDebt += installmentsLeft * pat.financingDetails!.installmentValue;
        }
      }
    });

    let currentEquity = currentBalance + totalMarketValue - currentRemainingDebt;

    // --- HISTÓRICO PASSADO (Retroprojeção Matemática) ---
    let oldestDate = new Date(today.getFullYear(), today.getMonth(), 1);
    transactions.forEach(tx => {
      const txDate = new Date(tx.dueDate);
      if (txDate < oldestDate) {
        oldestDate = new Date(txDate.getFullYear(), txDate.getMonth(), 1);
      }
    });

    patrimonies.forEach(pat => {
      const patDate = new Date((pat as any).createdAt || today);
      if (patDate < oldestDate) {
        oldestDate = new Date(patDate.getFullYear(), patDate.getMonth(), 1);
      }
      if (pat.financingDetails && pat.financingDetails.startDate) {
        const startDate = new Date(pat.financingDetails.startDate);
        if (startDate < oldestDate) {
          oldestDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1);
        }
      }
    });

    const monthsPassed = (today.getFullYear() - oldestDate.getFullYear()) * 12 + (today.getMonth() - oldestDate.getMonth());
    console.log("DEBUG: oldestDate =", oldestDate, "monthsPassed =", monthsPassed);

    let backwardsBalance = currentBalance;
    const timeline = [];
    
    // Gerar de i = 0 até -monthsPassed
    for (let i = 0; i >= -monthsPassed; i--) {
      const targetDate = new Date(today.getFullYear(), today.getMonth() + i, 1);
      const targetMonth = targetDate.getMonth();
      const targetYear = targetDate.getFullYear();

      let monthlyIncomes = 0;
      let monthlyExpenses = 0;
      let pastRentIncomes = 0;
      let pastSalaryIncomes = 0;
      let pastFixedExpenses = 0;
      let pastPatrimonyInstallments = 0;

      const detailedTransactions: any[] = [];

      transactions.forEach(tx => {
        const txDate = new Date(tx.dueDate);
        if (txDate.getMonth() === targetMonth && txDate.getFullYear() === targetYear) {
            detailedTransactions.push({
              id: tx.id,
              type: tx.type,
              source: tx.source === "FINANCING" ? tx.description : (tx.description || tx.source),
              amount: tx.amount,
              day: txDate.getDate()
            });

            if (tx.type === "INCOME") {
              monthlyIncomes += tx.amount;
              if (tx.source === "RENT") pastRentIncomes += tx.amount;
              else pastSalaryIncomes += tx.amount;
            } else {
              monthlyExpenses += tx.amount;
              if (tx.source === "FINANCING" || tx.patrimonyId) pastPatrimonyInstallments += tx.amount;
              else pastFixedExpenses += tx.amount;
            }
          }
      });

      let remainingDebt = 0;
      financedPatrimonies.forEach(pat => {
        if (pat.financingDetails && pat.financingDetails.endDate) {
          const end = new Date(pat.financingDetails.endDate);
          const installmentsLeft = (end.getUTCFullYear() - today.getFullYear()) * 12 + (end.getUTCMonth() - today.getMonth()) - i;
          if (installmentsLeft > 0) {
            remainingDebt += installmentsLeft * pat.financingDetails!.installmentValue;
          }
        }
      });

      let projectedEquity = backwardsBalance + totalMarketValue - remainingDebt;
      const dateStr = `${targetMonth + 1}/${targetYear}`;

      // Usamos unshift para que os meses mais antigos fiquem no começo do array (ordem cronológica)
      timeline.unshift({
        monthIndex: i,
        date: dateStr,
        projectedBalance: backwardsBalance,
        projectedEquity,
        incomes: monthlyIncomes,
        expenses: monthlyExpenses,
        detailedTransactions,
        composition: {
          rentIncomes: pastRentIncomes,
          salaryIncomes: pastSalaryIncomes,
          fixedExpenses: pastFixedExpenses,
          patrimonyInstallments: pastPatrimonyInstallments
        }
      });

      // Prepara o backwardsBalance para o mês anterior (i-1)
      // O saldo no mês anterior é o saldo atual MENOS receitas do mês atual MAIS despesas do mês atual
      backwardsBalance = backwardsBalance - monthlyIncomes + monthlyExpenses;
    }

    // --- LOOP DE SIMULAÇÃO (Futuro) ---

    for (let i = 1; i <= maxMonths; i++) {
      let rentIncomes = totalRentIncome;
      let salaryIncomes = 0;
      let fixedExpenses = 0;
      let patrimonyInstallments = 0;
      
      const detailedTransactions = [];

      // Checa TODAS as transações cadastradas (físicas - incluindo parcelas do patrimônio geradas no momento da criação)
      const targetDate = new Date(today.getFullYear(), today.getMonth() + i, 1);
      const targetMonth = targetDate.getMonth();
      const targetYear = targetDate.getFullYear();

      // SIMULATION: SELL_CAR no mês 1
      if (simulateScenario === "SELL_CAR" && i === 1) {
        salaryIncomes += 50000;
        detailedTransactions.push({
          id: "sim-sell-car",
          type: "INCOME",
          source: "Venda de Veículo (Stress Test)",
          amount: 50000,
          day: 1
        });
      }

      // SIMULATION: NEW_BABY todos os meses a partir do 1
      if (simulateScenario === "NEW_BABY" && i >= 1) {
        fixedExpenses += 3000;
        detailedTransactions.push({
          id: `sim-baby-${i}`,
          type: "EXPENSE",
          source: "Gasto Fixo Bebê (Stress Test)",
          amount: 3000,
          day: 5
        });
      }

      // 4. Receitas de Aluguéis (Incomes)
      rents.forEach((r: any) => {
        detailedTransactions.push({
          id: `virtual-rent-${r.id}-${i}`,
          type: "INCOME",
          source: `Aluguel: ${r.tenant}`,
          amount: Number(r.value),
          day: 10
        });
      });

      transactions.forEach(tx => {
        if (!tx.isPaid) {
          const txDate = new Date(tx.dueDate);
          if (txDate.getMonth() === targetMonth && txDate.getFullYear() === targetYear) {
            
            detailedTransactions.push({
              id: tx.id,
              type: tx.type,
              source: tx.source === "FINANCING" ? tx.description : (tx.description || tx.source),
              amount: tx.amount,
              day: txDate.getDate()
            });

            if (tx.type === "INCOME") {
              // SIMULATION: LOSS_JOB zera receitas recorrentes (salário)
              if (simulateScenario === "LOSS_JOB" && tx.isRecurring) {
                // Não adiciona no salaryIncomes
                detailedTransactions[detailedTransactions.length - 1].source += " [ZERADO - DEMISSÃO]";
                detailedTransactions[detailedTransactions.length - 1].amount = 0;
              } else {
                salaryIncomes += tx.amount;
              }
            }
            if (tx.type === "EXPENSE") {
              if (tx.source === "FINANCING" || tx.patrimonyId) {
                patrimonyInstallments += tx.amount;
              } else {
                fixedExpenses += tx.amount;
              }
            }
          }
        }
      });

      // (Removido: a injeção manual das parcelas de patrimônios financiados agora é inútil pois as transações já existem fisicamente)
      
      // Calcular dívida restante neste mês 'i' para obter o Equity exato
      let remainingDebt = 0;
      financedPatrimonies.forEach(pat => {
        if (pat.financingDetails && pat.financingDetails.endDate) {
          const end = new Date(pat.financingDetails.endDate);
          const installmentsLeft = (end.getUTCFullYear() - today.getFullYear()) * 12 + (end.getUTCMonth() - today.getMonth()) - i;
          if (installmentsLeft > 0) {
            remainingDebt += installmentsLeft * pat.financingDetails!.installmentValue;
          }
        }
      });

      let monthlyIncomes = rentIncomes + salaryIncomes;
      let monthlyExpenses = fixedExpenses + patrimonyInstallments;

      projectedBalance = projectedBalance + monthlyIncomes - monthlyExpenses;
      let projectedEquity = projectedBalance + totalMarketValue - remainingDebt;

      const dateObj = new Date(today.getFullYear(), today.getMonth() + i, 1);
      const dateStr = `${dateObj.getMonth() + 1}/${dateObj.getFullYear()}`;

      timeline.push({
        monthIndex: i,
        date: dateStr,
        projectedBalance,
        projectedEquity,
        incomes: monthlyIncomes,
        expenses: monthlyExpenses,
        detailedTransactions,
        composition: {
          rentIncomes,
          salaryIncomes,
          fixedExpenses,
          patrimonyInstallments
        }
      });

      // Checa a quebra
      if (projectedBalance < 0 && bankruptMonthIndex === null) {
        bankruptMonthIndex = i;
        bankruptDate = dateStr;
        projectedDebt = projectedBalance;

        // Gera o plano de resgate
        const deficit = Math.abs(projectedBalance);
        let selectedBailout: IPatrimony | null = null;
        
        for (const asset of bailoutAssets) {
          if (asset.marketValue >= deficit) {
            selectedBailout = asset;
            break; // Acha o primeiro (mais barato) que cobre a dívida
          }
        }

        if (selectedBailout) {
          bailoutPlan = `Você ficará negativo em ${dateStr}. Recomendação: Vender o bem [${selectedBailout.name}] por R$ ${selectedBailout.marketValue} para manter o fluxo de caixa saudável.`;
        } else {
          bailoutPlan = `Você ficará negativo em ${dateStr} e não possui bens suficientes cadastrados para cobrir o déficit de R$ ${deficit}. Aumente sua renda ou reduza gastos.`;
        }
      }
    }

    return {
      currentBalance,
      currentEquity,
      projectionMonths: maxMonths,
      bankruptMonthIndex,
      bankruptDate,
      projectedDebt,
      bailoutPlan,
      timeline,
    };
  }
}
