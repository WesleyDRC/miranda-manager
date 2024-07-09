import { Category } from "../infra/mongoose/entities/Category"

export class InitializeCategoriesUseCase {
  async execute(): Promise<void> {
    const defaultCategories = [
      { name: "CDB"},
      { name: "Tesouro Direto"},
      { name: "Aluguel"},
    ];

    for (const category of defaultCategories) {
      const existingCategory = await Category.findOne({ name: category.name });
      if (!existingCategory) {
        await Category.create(category);
      }
    }
  }
}
