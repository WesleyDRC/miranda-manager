import { IStoreRentMonthDTO } from "../dtos/IStoreRentMonthDTO";
import { IRentMonth } from "../entities/IRentMonth";
import { RentMonth } from "../models/RentMonth";
import { IRentMonthRepository } from "./IRentMonthRepository";


export class RentMonthRepository implements IRentMonthRepository {
	async findAll(): Promise<IRentMonth[]> {
		const rentMonthFound = await RentMonth.find()

		let rentMonths = []

		rentMonthFound.forEach(rentMonth => {
			rentMonths.push({
				id: rentMonth._id,
				dateMonth: rentMonth.dateMonth,
				amountPaid: rentMonth.amountPaid,
				paid: rentMonth.paid,
				rentId: rentMonth.rentId
			})
		})

		return rentMonths
	}

	async create(
		rentMonth: IStoreRentMonthDTO
	): Promise<IRentMonth> {

		const rentMonthCreated = await RentMonth.create({
			dateMonth: rentMonth.dateMonth,
			amountPaid: rentMonth.amountPaid,
			paid: rentMonth.paid,
			rentId: rentMonth.rentId
		})

		return {
      id: rentMonthCreated._id.toString(),
      dateMonth: rentMonthCreated.dateMonth,
      amountPaid: rentMonthCreated.amountPaid,
      paid: rentMonthCreated.paid,
      rentId: rentMonthCreated.rentId,
    };
	}
	
	async findByRentId(rentId: string): Promise<IRentMonth[]> {
		const monthsFound = await RentMonth.find({
			rentId: rentId
		})

		const months = []

		monthsFound.forEach(month => {
			months.push({
				id: month._id,
				dateMonth: month.dateMonth,
				amountPaid: month.amountPaid,
				paid: month.paid,
				rentId: month.rentId
			})
		})

		return months
	}

	async findLastMonthByRentId(rentId: string): Promise<IRentMonth | []> {
		const lastMonth = await RentMonth.find({ rentId: rentId }).sort({ dateMonth: -1}).limit(1)
		
		if (lastMonth.length < 1)
			return []
		
		return {
			id: lastMonth[0]._id.toString(),
			dateMonth: lastMonth[0].dateMonth,
			amountPaid: lastMonth[0].amountPaid,
			paid: lastMonth[0].paid,
			rentId: lastMonth[0].rentId
		}	
	}
}