import { inject, injectable } from "tsyringe";
import { IWalletRepository } from "@/modules/wallets/repositories/IWalletRepository";
import { ITransactionRepository } from "@/modules/transactions/repositories/ITransactionRepository";
import { IPatrimonyRepository } from "@/modules/patrimony/repositories/IPatrimonyRepository";
import { IRentRepository } from "@/modules/rent/repositories/IRentRepository";
import { ITreasuryInvestmentRepository } from "@/modules/treasury/repositories/ITreasuryInvestmentRepository";
import { ITreasuryMovementRepository } from "@/modules/treasury/repositories/ITreasuryMovementRepository";
import { ITransaction } from "@/modules/transactions/entities/ITransaction";
import { IPatrimony } from "@/modules/patrimony/entities/IPatrimony";
import { ITreasuryInvestment } from "@/modules/treasury/entities/ITreasuryInvestment";
import { ITreasuryMovement } from "@/modules/treasury/entities/ITreasuryMovement";

export interface IForecastContextData {
  currentBalance: number;
  transactions: ITransaction[];
  patrimonies: IPatrimony[];
  financedPatrimonies: IPatrimony[];
  bailoutAssets: any[];
  totalMarketValue: number;
  rents: any[];
  totalRentIncome: number;
  investments: ITreasuryInvestment[];
  allMovements: ITreasuryMovement[];
}

@injectable()
export class ForecastDataFetcher {
  constructor(
    @inject("WalletRepository")
    private walletRepository: IWalletRepository,
    @inject("TransactionRepository")
    private transactionRepository: ITransactionRepository,
    @inject("PatrimonyRepository")
    private patrimonyRepository: IPatrimonyRepository,
    @inject("RentRepository")
    private rentRepository: IRentRepository,
    @inject("TreasuryInvestmentRepository")
    private treasuryInvestmentRepository: ITreasuryInvestmentRepository,
    @inject("TreasuryMovementRepository")
    private treasuryMovementRepository: ITreasuryMovementRepository
  ) {}

  public async fetchAll(userId: string): Promise<IForecastContextData> {
    // 1. Coletar Saldo Atual
    const wallets = await this.walletRepository.findByUserId(userId);
    const currentBalance = wallets.reduce((acc, wallet) => acc + wallet.balance, 0);

    // 2. Coletar Entradas e Saídas
    const transactions = await this.transactionRepository.findByUserId(userId);

    // 3. Patrimônio Financiado (Despesas) e Resgate
    const patrimonies = await this.patrimonyRepository.findByUserId(userId);
    const financedPatrimonies = patrimonies.filter(p => p.isFinanced && p.financingDetails);
    const bailoutAssets = [...patrimonies].sort((a, b) => a.marketValue - b.marketValue);
    const totalMarketValue = patrimonies.reduce((acc, p) => acc + p.marketValue, 0);

    // 4. Receitas de Aluguéis (Incomes)
    const allRents = await this.rentRepository.findAll(userId);
    const rents = allRents.filter((r: any) => r.status !== "finished");
    const totalRentIncome = rents.reduce((acc: number, r: any) => acc + Number(r.value), 0);

    // 5. Investimentos Tesouro Direto
    const investments = await this.treasuryInvestmentRepository.findByUserId(userId);
    
    // Resolve Query N+1 Issue
    const investmentIds = investments.map(inv => inv.id);
    const allMovements = await this.treasuryMovementRepository.findByTreasuryIds(investmentIds);

    return {
      currentBalance,
      transactions,
      patrimonies,
      financedPatrimonies,
      bailoutAssets,
      totalMarketValue,
      rents,
      totalRentIncome,
      investments,
      allMovements
    };
  }
}
