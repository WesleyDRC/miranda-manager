import { IStoreCategoryDTO } from "../../../dtos/IStoreCategoryDTO";
import { ICategoryRepository } from "../../../repositories/ICategoryRepository";
import { Category } from "../entities/Category";
import { ICategory } from "../../../entities/ICategory";
import { AppError } from "../../../../../shared/errors/AppError";

import { categoryConstants } from "../../../contants/categoryContants";

export class CategoryRepository implements ICategoryRepository {
  async create({ name, userId }: IStoreCategoryDTO): Promise<ICategory> {
    const createCategory = await Category.create({ name, userId });

    const category: ICategory = {
      id: createCategory.id,
      name: createCategory.name,
      userId: createCategory.userId,
    };

    return Promise.resolve(category);
  }

  async findByName(name: string): Promise<ICategory | {}> {
    const categoryFound = await Category.findOne({ name });

    return Promise.resolve(categoryFound ? categoryFound : null);
  }

  async getCategory(userId: string): Promise<ICategory[] | []> {
    const categoriesFound = await Category.find({ userId });

    if (categoriesFound.length < 0) {
      throw new AppError(categoryConstants.NOT_FOUND, 404);
    }

    let categories = [];

    for (let i = 0; i < categoriesFound.length; i++) {
      const category: ICategory = {
        id: categoriesFound[i].id,
        name: categoriesFound[i].name,
        userId: categoriesFound[i].userId,
      };

      categories.push(category);
    }

    return Promise.resolve(categories);
  }

  async fingById(id: string): Promise<ICategory | []> {
    const categoryFound = await Category.findOne({ _id: id });
		
    if (!categoryFound) {
      return null;
    }

    return {
      id: categoryFound._id,
      name: categoryFound.name,
      userId: categoryFound.userId,
    };
  }
}
