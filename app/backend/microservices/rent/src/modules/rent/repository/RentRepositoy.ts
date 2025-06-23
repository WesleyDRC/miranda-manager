import { Rent } from "../models/Rent";
import { IRent } from "../models/Rent"

import { IRentRepository } from "./IRentRepository";

export class RentRepository implements IRentRepository {
	async findAll(): Promise<IRent[]> {
		const rentsFound= await Rent.find()

		let rents = []

		rentsFound.forEach(rent => {
			rents.push({
				id: rent._id,
				userId: rent.userId
			})
		})

		return rents
	}
}