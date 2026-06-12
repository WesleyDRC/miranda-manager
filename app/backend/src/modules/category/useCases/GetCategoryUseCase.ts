import { inject, injectable } from "tsyringe";

import { IUseCase } from "@/modules/category/useCases/ports/IUseCase";
import { ICategoryRepository } from "@/modules/category/repositories/ICategoryRepository";


@injectable()
export class GetCategoryUseCase implements IUseCase {
	constructor(
		@inject("CategoryRepository")
		private categoryRepository: ICategoryRepository
	) {}


	async execute(): Promise<any> {
		const categories = await this.categoryRepository.getCategory()

		return categories
	}

}