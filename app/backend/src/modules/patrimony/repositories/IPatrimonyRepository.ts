import { ICreatePatrimonyDTO } from "../dtos/ICreatePatrimonyDTO";
import { IPatrimony } from "../entities/IPatrimony";

export interface IPatrimonyRepository {
  create(data: ICreatePatrimonyDTO): Promise<IPatrimony>;
  findByUserId(userId: string): Promise<IPatrimony[]>;
  findById(id: string): Promise<IPatrimony | null>;
  update(id: string, data: Partial<IPatrimony>): Promise<IPatrimony>;
  delete(id: string): Promise<void>;
}
