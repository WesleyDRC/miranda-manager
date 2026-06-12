export interface IStoreFinanceDTO {
	name: string,
	rent?: {
		name: string,
		value: string,
		street: string,
		streetNumber: string,
		startRental: string,
		userId: string,
		fixedExpenses?: { reason: string; amount: number }[]
	},
	category?: string,
	rentId?: string,
	categoryId?: string,
	userId: string
}