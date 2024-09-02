export interface IStoreRentMonthDTO {
	dateMonth: Date,
	amountPaid?: number,
	paid?: boolean,
	receipt: string,
	rentId: string
}