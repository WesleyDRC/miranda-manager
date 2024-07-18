export interface IFinance {
	id: string,
	name: string,
	category?: {
		id: string,
		name: string
	},
	rent?: {
		name: string,
		value: string,
		street: string,
		streetNumber: string,
		startRental: string,
		grossIncome: number,
		netIncome: number,
		userId: string
	},
	categoryId?: string,
	rentId?: string,
	userId: string
}