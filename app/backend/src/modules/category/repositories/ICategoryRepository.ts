import { IStoreCategoryDTO } from "@/modules/category/dtos/IStoreCategoryDTO";
import { ICategory } from "@/modules/category/entities/ICategory";

export interface ICategoryRepository {
	create(category: IStoreCategoryDTO): Promise<ICategory>
	findByName(name:string): Promise<ICategory | null>
	getCategory(): Promise<ICategory[] | []> 
	findById(id: string): Promise<ICategory| null>
}