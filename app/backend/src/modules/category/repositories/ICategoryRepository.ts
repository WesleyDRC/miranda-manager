import { IStoreCategoryDTO } from "../dtos/IStoreCategoryDTO";
import { ICategory } from "../entities/ICategory";

export interface ICategoryRepository {
	create(category: IStoreCategoryDTO): Promise<ICategory>
	findByName(name:string): Promise<ICategory | {}>
	getCategory(): Promise<ICategory[] | []> 
	findById(id: string): Promise<ICategory| null>
}