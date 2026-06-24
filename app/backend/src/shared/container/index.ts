import "./providers"

import { container } from "tsyringe";

import { AuthRepository } from "@/modules/auth/infra/mongoose/repository/AuthRepository";
import { IAuthRepository } from "@/modules/auth/repositories/IAuthRepository";

import { CategoryRepository } from "@/modules/category/infra/mongoose/repository/CategoryRepository";
import { ICategoryRepository } from "@/modules/category/repositories/ICategoryRepository";

import { FinanceRepository } from "@/modules/finances/infra/mongoose/repository/FinanceRepository";
import { IFinanceRepository } from "@/modules/finances/repositories/IFinanceRepository";

import { RentRepository } from "@/modules/rent/infra/mongoose/repository/RentRepository";
import { IRentRepository } from "@/modules/rent/repositories/IRentRepository";

import { WalletRepository } from "@/modules/wallets/infra/mongoose/repository/WalletRepository";
import { IWalletRepository } from "@/modules/wallets/repositories/IWalletRepository";

import { PatrimonyRepository } from "@/modules/patrimony/infra/mongoose/repository/PatrimonyRepository";
import { IPatrimonyRepository } from "@/modules/patrimony/repositories/IPatrimonyRepository";

import { TransactionRepository } from "@/modules/transactions/infra/mongoose/repository/TransactionRepository";
import { ITransactionRepository } from "@/modules/transactions/repositories/ITransactionRepository";

import { RecurrenceRuleRepository } from "@/modules/transactions/infra/mongoose/repository/RecurrenceRuleRepository";
import { IRecurrenceRuleRepository } from "@/modules/transactions/repositories/IRecurrenceRuleRepository";

import { TreasuryInvestmentRepository } from "@/modules/treasury/infra/mongoose/repository/TreasuryInvestmentRepository";
import { ITreasuryInvestmentRepository } from "@/modules/treasury/repositories/ITreasuryInvestmentRepository";

import { TreasuryMovementRepository } from "@/modules/treasury/infra/mongoose/repository/TreasuryMovementRepository";
import { ITreasuryMovementRepository } from "@/modules/treasury/repositories/ITreasuryMovementRepository";

import { TreasurySnapshotRepository } from "@/modules/treasury/infra/mongoose/repository/TreasurySnapshotRepository";
import { ITreasurySnapshotRepository } from "@/modules/treasury/repositories/ITreasurySnapshotRepository";

import { TreasuryProductRepository } from "@/modules/treasury/infra/mongoose/repositories/TreasuryProductRepository";
import { ITreasuryProductRepository } from "@/modules/treasury/repositories/ITreasuryProductRepository";

import { MongoMarketDataRepository } from "@/core/market-data/infrastructure/repositories/MongoMarketDataRepository";
import { IMarketDataRepository } from "@/core/market-data/domain/repositories/IMarketDataRepository";

import { BCBMarketDataProvider } from "@/core/market-data/infrastructure/providers/BCBMarketDataProvider";
import { IMarketDataProvider } from "@/core/market-data/domain/providers/IMarketDataProvider";

container.registerSingleton<IAuthRepository>("AuthRepository", AuthRepository)
container.registerSingleton<ICategoryRepository>("CategoryRepository", CategoryRepository)
container.registerSingleton<IFinanceRepository>("FinanceRepository", FinanceRepository)
container.registerSingleton<IRentRepository>("RentRepository", RentRepository)
container.registerSingleton<IWalletRepository>("WalletRepository", WalletRepository)
container.registerSingleton<IPatrimonyRepository>("PatrimonyRepository", PatrimonyRepository)
container.registerSingleton<ITransactionRepository>("TransactionRepository", TransactionRepository)
container.registerSingleton<IRecurrenceRuleRepository>("RecurrenceRuleRepository", RecurrenceRuleRepository)
container.registerSingleton<ITreasuryInvestmentRepository>("TreasuryInvestmentRepository", TreasuryInvestmentRepository)
container.registerSingleton<ITreasuryMovementRepository>("TreasuryMovementRepository", TreasuryMovementRepository)
container.registerSingleton<ITreasurySnapshotRepository>("TreasurySnapshotRepository", TreasurySnapshotRepository)
container.registerSingleton<ITreasuryProductRepository>("TreasuryProductRepository", TreasuryProductRepository)
container.registerSingleton<IMarketDataRepository>("MarketDataRepository", MongoMarketDataRepository)
container.registerSingleton<IMarketDataProvider>("MarketDataProvider", BCBMarketDataProvider)

import { TaxCalculationService } from "@/modules/treasury/services/TaxCalculationService";
container.registerSingleton<TaxCalculationService>("TaxCalculationService", TaxCalculationService);

import { ForecastDataFetcher } from "@/modules/forecast/services/ForecastDataFetcher";
import { TreasuryProjectionCalculator } from "@/modules/forecast/services/TreasuryProjectionCalculator";
import { EquityProjectionCalculator } from "@/modules/forecast/services/EquityProjectionCalculator";
import { AutoBailoutStrategy } from "@/modules/forecast/services/AutoBailoutStrategy";
import { TimelineBuilder } from "@/modules/forecast/services/TimelineBuilder";

container.registerSingleton<ForecastDataFetcher>("ForecastDataFetcher", ForecastDataFetcher);
container.registerSingleton<TreasuryProjectionCalculator>("TreasuryProjectionCalculator", TreasuryProjectionCalculator);
container.registerSingleton<EquityProjectionCalculator>("EquityProjectionCalculator", EquityProjectionCalculator);
container.registerSingleton<AutoBailoutStrategy>("AutoBailoutStrategy", AutoBailoutStrategy);
container.registerSingleton<TimelineBuilder>("TimelineBuilder", TimelineBuilder);