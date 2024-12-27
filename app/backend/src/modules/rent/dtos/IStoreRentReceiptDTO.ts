export interface IStoreRentReceiptDTO {
	receipt: Express.Multer.File | string, 
	rentMonthId: string
}