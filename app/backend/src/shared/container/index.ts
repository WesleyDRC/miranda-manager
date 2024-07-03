import "./providers"

import { container } from "tsyringe";

import { AuthRepository } from "../../modules/auth/infra/mongoose/repository/AuthRepository";
import { IAuthRepository } from "../../modules/auth/repositories/IAuthRepository";

import { CategoryRepository } from "../../modules/category/infra/mongoose/repository/CategoryRepository";
import { ICategoryRepository } from "../../modules/category/repositories/ICategoryRepository";

import { FinanceRepository } from "../../modules/finances/infra/mongoose/repository/FinanceRepository";
import { IFinanceRepository } from "../../modules/finances/repositories/IFinanceRepository";

container.registerSingleton<IAuthRepository>("AuthRepository", AuthRepository)
container.registerSingleton<ICategoryRepository>("CategoryRepository", CategoryRepository)
container.registerSingleton<IFinanceRepository>("FinanceRepository", FinanceRepository)