import { inject, injectable } from "tsyringe";

import { IStoreFinanceDTO } from "../dtos/IStoreFinanceDTO";
import { IUseCase } from "./ports/IUseCase";
import { IFinanceRepository } from "../repositories/IFinanceRepository";
import { IRentRepository } from "../../rent/repositories/IRentRepository";
import { ICategoryRepository } from "../../category/repositories/ICategoryRepository";
import { IFinance } from "../entities/IFinance";
import { ICategory } from "../../category/entities/ICategory";

import { financeConstants } from "../contants/financeContants";
import { categoryConstants } from "../../category/contants/categoryContants";

import { AppError } from "../../../shared/errors/AppError";

@injectable()
export class CreateFinanceUseCase implements IUseCase {
  constructor(
    @inject("FinanceRepository")
    private financeRepository: IFinanceRepository,

    @inject("CategoryRepository")
    private categoryRepository: ICategoryRepository,

    @inject("RentRepository")
    private rentRepository: IRentRepository
  ) {}

  async execute({
    name,
    rent,
    categoryId,
    userId,
  }: IStoreFinanceDTO): Promise<IFinance> {
    await this.ensureFinanceDoesNotExist(name);

    const category = await this.getCategory(categoryId);

    const rentCreated = await this.createRentIfNeeded(
      category.name,
      rent,
      userId
    );

    const rentMonths = await this.createRentMonthIfNeeded(
      category.name,
      rent.startRental,
      rentCreated.id
    );

    rentCreated.months = rentMonths

    const financeCreated = await this.financeRepository.create({
      name,
      categoryId,
      rentId: rentCreated.id,
      userId,
    });

    const finance: IFinance = {
      id: financeCreated.id,
      name: financeCreated.name,
      category: category,
      rent: rentCreated,
      userId: financeCreated.userId,
    };

    return finance;
  }

  private async getCategory(categoryId: string): Promise<ICategory> {
    const category = await this.categoryRepository.findById(categoryId);
    if (!category) {
      throw new AppError(categoryConstants.NOT_FOUND, 404);
    }
    return category;
  }

  private async ensureFinanceDoesNotExist(name: string): Promise<void> {
    const financeFound = await this.financeRepository.findByName(name);
    if (financeFound) {
      throw new AppError(financeConstants.ALREADY_EXISTS, 409);
    }
  }

  private async createRentIfNeeded(
    categoryName: string,
    rent: any,
    userId: string
  ) {
    if (categoryName !== "Aluguel") {
      return null;
    }

    const rentCreated = await this.rentRepository.create({
      name: rent.name,
      value: rent.value,
      street: rent.street,
      streetNumber: rent.streetNumber,
      startRental: rent.startRental,
      userId: userId,
    });

    return rentCreated;
  }

  private async createRentMonthIfNeeded(
    categoryName: string,
    startRental: string,
    rentId: string
  ) {

    if (categoryName !== "Aluguel") {
      return null;
    }

    const [day, month, year] = startRental.split("/").map(Number);

    const currentMonth = new Date().getMonth() + 1

    const months = [];

    for (let i = month; i <= currentMonth; i++) {

      const monthCreated = i - 1

      const date = new Date(year, monthCreated, day);

      months.push(
        await this.rentRepository.createRentMonth({
          dateMonth: date,
          rentId: rentId,
        })
      )
    }

    return months
  }
}
