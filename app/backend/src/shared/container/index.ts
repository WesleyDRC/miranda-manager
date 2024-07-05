import "./providers"

import { container } from "tsyringe";

import { AuthRepository } from "../../modules/auth/infra/mongoose/repository/AuthRepository";
import { IAuthRepository } from "../../modules/auth/repositories/IAuthRepository";

import { CategoryRepository } from "../../modules/category/infra/mongoose/repository/CategoryRepository";
import { ICategoryRepository } from "../../modules/category/repositories/ICategoryRepository";

import { FinanceRepository } from "../../modules/finances/infra/mongoose/repository/FinanceRepository";
import { IFinanceRepository } from "../../modules/finances/repositories/IFinanceRepository";

import { RentRepository } from "../../modules/rent/infra/mongoose/repository/RentRepository";
import { IRentRepository } from "../../modules/rent/repositories/IRentRepository";


container.registerSingleton<IAuthRepository>("AuthRepository", AuthRepository)
container.registerSingleton<ICategoryRepository>("CategoryRepository", CategoryRepository)
container.registerSingleton<IFinanceRepository>("FinanceRepository", FinanceRepository)
container.registerSingleton<IRentRepository>("RentRepository", RentRepository)