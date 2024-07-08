import { inject, injectable } from "tsyringe";

import { ICategory } from "../entities/ICategory";
import { IUseCase } from "./ports/IUseCase";
import { ICategoryRepository } from "../repositories/ICategoryRepository";
import { AppError } from "../../../shared/errors/AppError";

import { categoryConstants } from "../contants/categoryContants";

@injectable()
export class GetCategoryByIdUseCase implements IUseCase {
	constructor(
		@inject("CategoryRepository")
		private categoryRepository: ICategoryRepository
	) {}

	async execute(id: string): Promise<ICategory | []> {
		
		const category = await this.categoryRepository.findById(id)

		if(!category) {
			throw new AppError(categoryConstants.NOT_FOUND, 404)
		}

		return category
	}
}