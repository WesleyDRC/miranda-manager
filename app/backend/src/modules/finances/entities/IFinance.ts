import { IRent } from "../../rent/entities/IRent"

export interface IFinance {
	id: string,
	name: string,
	category?: {
		id: string,
		name: string
	},
	rent?: IRent,
	categoryId?: string,
	rentId?: string,
	userId: string
}
