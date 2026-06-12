export interface IStoreRentDTO {
	tenant: string,
	value: string,
	street: string,
	streetNumber: string,
	startRental: string,
	userId: string,
	fixedExpenses?: { reason: string; amount: number }[]
}