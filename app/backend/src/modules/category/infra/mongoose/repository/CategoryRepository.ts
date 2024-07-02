import { IStoreCategoryDTO } from "../../../dtos/IStoreCategoryDTO";
import { ICategoryRepository } from "../../../repositories/ICategoryRepository";
import { Category } from "../entities/Category";
import { ICategory } from "../../../entities/ICategory";

export class CategoryRepository implements ICategoryRepository {
	async create({name, userId}: IStoreCategoryDTO): Promise<ICategory> {
		const createCategory = await Category.create({name, userId})

		const category: ICategory = {
			id: createCategory.id,
			name: createCategory.name,
			userId: createCategory.userId
		}

		return Promise.resolve(category)
	}

	async findByName(name: string): Promise<ICategory | {}> {
		const categoryFound = await Category.findOne({name})

		return Promise.resolve(categoryFound ? categoryFound : null)
	}
}