import { IStoreCategoryDTO } from "../../../dtos/IStoreCategoryDTO";
import { ICategoryRepository } from "../../../repositories/ICategoryRepository";
import { Category } from "../entities/Category";
import { ICategory } from "../../../entities/ICategory";
import { AppError } from "../../../../../shared/errors/AppError";

import { categoryConstants } from "../../../contants/categoryContants";

export class CategoryRepository implements ICategoryRepository {
  async create({ name }: IStoreCategoryDTO): Promise<ICategory> {
    const createCategory = await Category.create({ name });

    const category: ICategory = {
      id: createCategory.id,
      name: createCategory.name,
    };

    return Promise.resolve(category);
  }

  async findByName(name: string): Promise<ICategory | {}> {
    const categoryFound = await Category.findOne({ name });

    return Promise.resolve(categoryFound ? categoryFound : null);
  }

  async getCategory(): Promise<ICategory[] | []> {
    const categoriesFound = await Category.find();

    if (categoriesFound.length < 0) {
      throw new AppError(categoryConstants.NOT_FOUND, 404);
    }

    let categories = [];

    for (let i = 0; i < categoriesFound.length; i++) {
      const category: ICategory = {
        id: categoriesFound[i].id,
        name: categoriesFound[i].name,
      };

      categories.push(category);
    }

    return Promise.resolve(categories);
  }

  async findById(id: string): Promise<ICategory | null> {
    const categoryFound = await Category.findOne({ _id: id });
		
    if (!categoryFound) {
      return null;
    }

    return {
      id: categoryFound._id,
      name: categoryFound.name,
    };
  }
}
