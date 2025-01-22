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

    const currentDate = new Date();
    const startDate = new Date(year, month - 1, day); // (0-11) months in javascript go from 0 to 11
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
  
    const months = [];
  
    for (let date = new Date(startDate); date <= endDate; date.setMonth(date.getMonth() + 1)) {
      months.push(
        await this.rentRepository.createRentMonth({
          dateMonth: new Date(date), 
          rentId: rentId,
        })
      );
    }

    return months;
  }
}
