import { inject, injectable } from "tsyringe";

import { IUseCase } from "./ports/IUseCase";
import { ICategoryRepository } from "../repositories/ICategoryRepository";
import { IStoreCategoryDTO } from "../dtos/IStoreCategoryDTO";
import { ICategory } from "../entities/ICategory";

import { categoryConstants } from "../contants/categoryContants";
import { AppError } from "../../../shared/errors/AppError";

@injectable()
export class CreateCategoryUseCase implements IUseCase {
	constructor(
		@inject("CategoryRepository")
		private categoryRepository: ICategoryRepository
	) {}

	async execute({
		name
	}: IStoreCategoryDTO): Promise<ICategory> {
		const categoryFound = await this.categoryRepository.findByName(name)

		if(categoryFound) {
			throw new AppError(categoryConstants.ALREADY_EXISTS, 409)
		}
		
		const createCategory = await this.categoryRepository.create({name})
		
		return createCategory
	}
}