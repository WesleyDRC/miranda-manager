import { inject, injectable } from "tsyringe";

import { IUseCase } from "@/modules/category/useCases/ports/IUseCase";
import { ICategoryRepository } from "@/modules/category/repositories/ICategoryRepository";
import { IStoreCategoryDTO } from "@/modules/category/dtos/IStoreCategoryDTO";
import { ICategory } from "@/modules/category/entities/ICategory";

import { categoryConstants } from "@/modules/category/contants/categoryContants";
import { AppError } from "@/shared/errors/AppError";

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