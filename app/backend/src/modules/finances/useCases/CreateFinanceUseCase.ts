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
    category,
    userId,
  }: IStoreFinanceDTO): Promise<IFinance> {
    await this.ensureFinanceDoesNotExist(name);

    const categoryFound = await this.getCategory(category);

    const rentCreated = await this.createRentIfNeeded(
      categoryFound.name,
      rent,
      userId
    );

    const rentMonths = await this.createRentMonthIfNeeded(
      categoryFound.name,
      rent.startRental,
      rentCreated.id
    );

    rentCreated.months = rentMonths;

    const financeCreated = await this.financeRepository.create({
      name,
      categoryId: categoryFound.id,
      rentId: rentCreated.id,
      userId,
    });

    const finance: IFinance = {
      id: financeCreated.id,
      name: financeCreated.name,
      category: categoryFound,
      rent: rentCreated,
      userId: financeCreated.userId,
    };

    return finance;
  }

  private async getCategory(categoryName: string): Promise<ICategory> {
    const category = await this.categoryRepository.findByName(categoryName);

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
      tenant: rent.tenant,
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

    const currentMonth = new Date().getMonth() + 1;
    const currentYear = new Date().getFullYear();
    const currentDay = new Date().getDay() + 1;

    const startRentalDate = new Date(day, month, currentDay)
    const currentDate = new Date(currentYear, currentMonth, currentDay)

    console.log(`Current Date: ${currentDate}`)

    const quantityMonthsPerYear = 12

    const months = [];

    let quantityMonths = 0

    let monthsRent = []

    let firstAddition = true

    console.log(`Year: ${year}`)
    console.log(`current year: ${currentYear}`)

    let yearStarted = year

    while(yearStarted <= currentYear) {
      if(firstAddition && yearStarted <= currentYear - 1)
        for(let j = month; j <= quantityMonthsPerYear; j++) {
          const monthCreated = j - 1;
          const date = new Date(yearStarted, monthCreated, day);
          monthsRent.push(date)
        }
        yearStarted += 1
        firstAddition = false

      if(yearStarted <= currentYear - 1) {
        for(let k = 1; k <= quantityMonthsPerYear; k++) {
          const monthCreated = k - 1;
          const date = new Date(yearStarted, monthCreated, day);
          monthsRent.push(date)
        }
        yearStarted += 1
      }
      else {
        for (let i = 1; i <= currentMonth; i++) {
          const monthCreated = i - 1;
          const date = new Date(currentYear, monthCreated, day);

          monthsRent.push(date)
        }
      }
    }

    for (let i = 0; i < monthsRent.length; i++) {
      months.push(
        await this.rentRepository.createRentMonth({
          dateMonth: monthsRent[i],
          rentId: rentId,
        })
      );
    }

    return months;
  }
}
