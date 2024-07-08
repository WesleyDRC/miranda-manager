import { inject, injectable } from "tsyringe";

import { IUseCase } from "./ports/IUseCase";
import { ICategoryRepository } from "../repositories/ICategoryRepository";


@injectable()
export class GetCategoryUseCase implements IUseCase {
	constructor(
		@inject("CategoryRepository")
		private categoryRepository: ICategoryRepository
	) {}


	async execute(userId: string): Promise<any> {
		const categories = await this.categoryRepository.getCategory(userId)

		return categories
	}

}