import "reflect-metadata";
import { ForecastService } from "./ForecastService";
import { ForecastDataFetcher } from "./ForecastDataFetcher";
import { TimelineBuilder } from "./TimelineBuilder";
import { TreasuryProjectionCalculator } from "./TreasuryProjectionCalculator";
import { EquityProjectionCalculator } from "./EquityProjectionCalculator";
import { AutoBailoutStrategy } from "./AutoBailoutStrategy";

// Mocks simples para testar a engine isoladamente
class MockRepository {
  public data: any[] = [];
  async findByUserId() { return this.data; }
  async findAll() { return this.data; }
  async findByTreasuryId(id: string) { return this.data.filter(i => i.treasuryId === id); }
  async findByTreasuryIds(ids: string[]) { return this.data.filter(i => ids.includes(i.treasuryId)); }
}

describe("ForecastService - Tesouro Direto Integration", () => {
  let forecastService: ForecastService;
  let walletRepo: any, txRepo: any, patrimonyRepo: any, rentRepo: any;
  let treasuryInvRepo: any, treasuryMovRepo: any, taxCalculationService: any;

  beforeEach(() => {
    walletRepo = new MockRepository();
    txRepo = new MockRepository();
    patrimonyRepo = new MockRepository();
    rentRepo = new MockRepository();
    treasuryInvRepo = new MockRepository();
    treasuryMovRepo = new MockRepository();
    taxCalculationService = {
      execute: jest.fn().mockImplementation((investedAmount, currentValue, purchaseDate, treasuryType, targetDate) => {
        return {
          grossValue: currentValue,
          totalTaxes: 0,
          netValue: currentValue
        };
      })
    };

    const fetcher = new ForecastDataFetcher(
      walletRepo,
      txRepo,
      patrimonyRepo,
      rentRepo,
      treasuryInvRepo,
      treasuryMovRepo
    );

    const treasuryCalc = new TreasuryProjectionCalculator(taxCalculationService);
    const equityCalc = new EquityProjectionCalculator();
    const bailoutStrategy = new AutoBailoutStrategy();
    const timelineBuilder = new TimelineBuilder(treasuryCalc, equityCalc, bailoutStrategy);

    forecastService = new ForecastService(fetcher, timelineBuilder);
  });

  it("deve calcular o saldo projetado considerando rendimentos do Tesouro", async () => {
    walletRepo.data = [{ balance: 1000 }]; // Saldo atual = 1000
    
    // Investimento de 10.000 com taxa mensal de 1% (0.01)
    treasuryInvRepo.data = [{
      id: "inv-1",
      userId: "user-1",
      currentValue: 10000,
      monthlyEstimatedRate: 0.01,
      liquidityAvailable: false,
      purchaseDate: new Date()
    }];

    const result = await forecastService.execute("user-1", { simulationPeriod: "12_MONTHS" });
    
    // Mes 1: Rendimento = 10.000 * 0.01 = 100.
    const month1 = result.timeline.find(t => t.monthIndex === 1);
    expect(month1.composition.treasuryYield).toBeCloseTo(100);
    
    // Patrimônio inclui o Tesouro
    expect(result.currentEquity).toBe(11000); // 1000 carteira + 10000 tesouro
  });

  it("deve aplicar cenários corretamente na rentabilidade", async () => {
    walletRepo.data = [{ balance: 0 }];
    treasuryInvRepo.data = [{
      id: "inv-1",
      userId: "user-1",
      currentValue: 10000,
      monthlyEstimatedRate: 0.01,
      liquidityAvailable: false,
      purchaseDate: new Date()
    }];

    // Cenário Otimista: taxa * 1.2 = 0.012 -> 120
    const optResult = await forecastService.execute("user-1", {
       investmentScenario: "OPTIMISTIC",
       simulationPeriod: "12_MONTHS"
    });
    expect(optResult.timeline.find(t => t.monthIndex === 1).composition.treasuryYield).toBeCloseTo(120);

    // Cenário Conservador: taxa * 0.8 = 0.008 -> 80
    const consResult = await forecastService.execute("user-1", {
       investmentScenario: "CONSERVATIVE",
       simulationPeriod: "12_MONTHS"
    });
    expect(consResult.timeline.find(t => t.monthIndex === 1).composition.treasuryYield).toBeCloseTo(80);
  });

  it("deve cobrir déficit se houver liquidez disponível (bailout)", async () => {
    walletRepo.data = [{ balance: 1000 }];
    
    // Despesa que vai estourar o caixa
    txRepo.data = [{
      id: "tx-1",
      type: "EXPENSE",
      amount: 5000, // Vai ficar -4000
      dueDate: new Date(new Date().getFullYear(), new Date().getMonth() + 1, 5),
      isPaid: false
    }];

    treasuryInvRepo.data = [{
      id: "inv-1",
      userId: "user-1",
      titleName: "Tesouro Selic",
      currentValue: 10000,
      monthlyEstimatedRate: 0,
      liquidityAvailable: true, // Liquidez salva
      treasuryType: "SELIC",
      purchaseDate: new Date()
    }];

    const result = await forecastService.execute("user-1", { simulationPeriod: "12_MONTHS" });
    const month1 = result.timeline.find(t => t.monthIndex === 1);
    
    // Tinha 1000, pagou 5000 = -4000
    // Tesouro resgatou 4000 automático.
    // Balanço volta a zero.
    expect(month1.projectedBalance).toBe(0);
    
    // Tesouro diminuiu o saldo em 4000 (10000 -> 6000)
    expect(month1.investmentsState.find((i: any) => i.id === "inv-1").balance).toBe(6000);

    // Patrimônio final = 0 na conta + 6000 no tesouro = 6000
    expect(result.currentEquity).toBe(11000); // no momento zero: 1000 + 10000.
    expect(month1.projectedEquity).toBe(6000);
  });

  it("deve abater depósitos de tesouro da conta do usuário", async () => {
    walletRepo.data = [{ balance: 1000 }];
    
    treasuryInvRepo.data = [{
      id: "inv-1",
      userId: "user-1",
      currentValue: 1000,
      monthlyEstimatedRate: 0,
      liquidityAvailable: false,
      purchaseDate: new Date()
    }];

    // Próximo mês
    const nextMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 15);
    
    treasuryMovRepo.data = [{
      id: "mov-1",
      treasuryId: "inv-1",
      movementType: "DEPOSIT",
      amount: 500, // Aporte (tira dinheiro da conta)
      movementDate: nextMonth
    }];

    const result = await forecastService.execute("user-1", { simulationPeriod: "12_MONTHS" });
    
    // No mês 1, saldo inicial era 1000. Ocorreu depósito no tesouro de 500.
    // Deposit no tesouro = Despesa na conta. 1000 - 500 = 500 projetado na carteira.
    const month1 = result.timeline.find(t => t.monthIndex === 1);
    expect(month1.projectedBalance).toBe(500);
    expect(month1.composition.treasuryDeposits).toBe(500);
  });

  it("deve carregar todos os movimentos de tesouro usando findByTreasuryIds (resolve N+1)", async () => {
    walletRepo.data = [{ balance: 1000 }];
    treasuryInvRepo.data = [
      { id: "inv-1", userId: "user-1", currentValue: 5000, monthlyEstimatedRate: 0, liquidityAvailable: true, purchaseDate: new Date() },
      { id: "inv-2", userId: "user-1", currentValue: 5000, monthlyEstimatedRate: 0, liquidityAvailable: true, purchaseDate: new Date() }
    ];

    const spy = jest.spyOn(treasuryMovRepo, "findByTreasuryIds");

    await forecastService.execute("user-1", { simulationPeriod: "12_MONTHS" });

    expect(spy).toHaveBeenCalledTimes(1);
    expect(spy).toHaveBeenCalledWith(["inv-1", "inv-2"]);
  });
});
