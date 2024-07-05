import {IStoreRentDTO} from "../dtos/IStoreRent"

import { IRent } from "../entities/IRent"

export interface IRentRepository {
	create(rent: IStoreRentDTO): Promise<IRent>
}