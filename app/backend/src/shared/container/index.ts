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

container.registerSingleton<IAuthRepository>("AuthRepository", AuthRepository)
container.registerSingleton<ICategoryRepository>("CategoryRepository", CategoryRepository)
container.registerSingleton<IFinanceRepository>("FinanceRepository", FinanceRepository)
container.registerSingleton<IRentRepository>("RentRepository", RentRepository)
container.registerSingleton<IWalletRepository>("WalletRepository", WalletRepository)
container.registerSingleton<IPatrimonyRepository>("PatrimonyRepository", PatrimonyRepository)
container.registerSingleton<ITransactionRepository>("TransactionRepository", TransactionRepository)
container.registerSingleton<IRecurrenceRuleRepository>("RecurrenceRuleRepository", RecurrenceRuleRepository)