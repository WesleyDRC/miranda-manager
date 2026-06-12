import { inject, injectable } from "tsyringe";

import { IStoreFinanceDTO } from "@/modules/finances/dtos/IStoreFinanceDTO";
import { IUseCase } from "@/modules/finances/useCases/ports/IUseCase";
import { IFinanceRepository } from "@/modules/finances/repositories/IFinanceRepository";
import { IRentRepository } from "@/modules/rent/repositories/IRentRepository";
import { ICategoryRepository } from "@/modules/category/repositories/ICategoryRepository";
import { IFinance } from "@/modules/finances/entities/IFinance";
import { ICategory } from "@/modules/category/entities/ICategory";

import { financeConstants } from "@/modules/finances/contants/financeContants";
import { categoryConstants } from "@/modules/category/contants/categoryContants";

import { AppError } from "@/shared/errors/AppError";

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
      rent?.startRental,
      rentCreated?.id,
      userId,
      rent?.fixedExpenses || []
    );

    if (rentCreated) {
      rentCreated.months = rentMonths;
    }

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
      fixedExpenses: rent.fixedExpenses,
    });

    return rentCreated;
  }

  private async createRentMonthIfNeeded(
    categoryName: string,
    startRental: string,
    rentId: string,
    userId: string,
    fixedExpenses: { reason: string; amount: number }[]
  ) {
    if (categoryName !== "Aluguel") {
      return null;
    }

    const [day, month, year] = startRental.split("/").map(Number);

    const lastDayMonth = new Date(year, month, 0).getDate()
    const safeDay = Math.min(day, lastDayMonth)
    const currentDate = new Date();
    const startDate = new Date(year, month - 1, safeDay); // (0-11) months in javascript go from 0 to 11
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), safeDay);
  
    const months = [];
  
    for (let date = new Date(startDate); date <= endDate; date.setMonth(date.getMonth() + 1)) {
      const monthCreated = await this.rentRepository.createRentMonth({
        dateMonth: new Date(date), 
        rentId: rentId,
      });

      for (const expense of fixedExpenses) {
        await this.rentRepository.createRentExpense({
          amount: expense.amount,
          reason: expense.reason,
          rentMonthId: monthCreated.id,
          userId: userId,
        });
      }

      months.push(monthCreated);
    }

    return months;
  }
}
