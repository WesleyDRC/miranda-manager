import { IRent } from "../models/Rent";

export interface IRentRepository {
	findAll(): Promise<IRent[]>
}