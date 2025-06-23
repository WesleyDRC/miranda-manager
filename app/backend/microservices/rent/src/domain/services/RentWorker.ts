import dayjs from  "dayjs";

import { IRentRepository } from "../../modules/rent/repository/IRentRepository";
import { IRentMonthRepository } from "../../modules/rent-month/repository/IRentMonthRepository";


// Months: 80d23d33-13b1-4823-89a6-2ffe98ff3f0b
// [
//   {
//     id: 'aa05e983-e16f-420d-9205-df6f4181e3fa',
//     dateMonth: 2024-10-11T03:00:00.000Z,
//     amountPaid: 800,
//     paid: true,
//     rentId: '80d23d33-13b1-4823-89a6-2ffe98ff3f0b'
//   },
//   {
//     id: 'df160525-2dd6-4b26-84d2-e3bbfacef9ea',
//     dateMonth: 2024-11-11T03:00:00.000Z,
//     amountPaid: 800,
//     paid: true,
//     rentId: '80d23d33-13b1-4823-89a6-2ffe98ff3f0b'
//   },
//   {
//     id: 'a5862c5e-817e-4594-8928-176ec489aa1e',
//     dateMonth: 2024-12-11T03:00:00.000Z,
//     amountPaid: 800,
//     paid: true,
//     rentId: '80d23d33-13b1-4823-89a6-2ffe98ff3f0b'
//   },
//   {
//     id: 'c600ef7c-f17b-4b28-8283-251a0f494e7c',
//     dateMonth: 2025-01-11T03:00:00.000Z,
//     amountPaid: 800,
//     paid: true,
//     rentId: '80d23d33-13b1-4823-89a6-2ffe98ff3f0b'
//   }
// ]

export class RentWorker {
	constructor(
		private rentRepository: IRentRepository,
		private rentMonthRepository: IRentMonthRepository
	){}

	public async worker() {
		let rents = await this.rentRepository.findAll()

		rents.forEach(async rent => {
			const lastRentMonth = await this.rentMonthRepository.findLastMonthByRentId(rent.id)

			if (lastRentMonth)

			let lastMonthDate = lastRentMonth.dateMonth

		})


		// console.log(rents)

		return rents
	}
}