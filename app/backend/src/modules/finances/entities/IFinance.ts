export interface IFinance {
	id: string,
	name: string,
	category?: {
		id: string,
		name: string,
		userId: string
	},
	rent?: {
		name: string,
		value: string,
		street: string,
		streetNumber: string,
		startRental: string,
		userId: string
	},
	categoryId?: string,
	rentId?: string,
	userId: string
}