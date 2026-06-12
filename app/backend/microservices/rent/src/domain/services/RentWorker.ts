import { IRentRepository } from "../../modules/rent/repository/IRentRepository";
import { IRentMonthRepository } from "../../modules/rent-month/repository/IRentMonthRepository";
import { IRentMonth } from "../../modules/rent-month/entities/IRentMonth";
import { IRentExpenseRepository } from "../../modules/rent-expense/repository/IRentExpenseRepository";
import { IRent } from "../../modules/rent/models/Rent";

export class RentWorker {
	constructor(
		private rentRepository: IRentRepository,
		private rentMonthRepository: IRentMonthRepository,
		private rentExpenseRepository: IRentExpenseRepository
	){}

	public async worker() {
		let rents = await this.rentRepository.findAll()

		for (const rent of rents) {
			let lastRentMonth = await this.rentMonthRepository.findLastMonthByRentId(rent.id);

			let lastMonthDate: Date;

			if (!lastRentMonth) {
				const [day, month, year] = rent.startRental.split("/").map(Number);

				lastMonthDate = new Date(year, month - 1, day)
			} else {
				lastMonthDate = lastRentMonth.dateMonth
			}

			const months = await this.createRentMonthIfNeeded(lastMonthDate, rent);

			console.log(`Total Months created ${months.length}`)

		}

		return rents
	}

	private async createRentMonthIfNeeded(
    lastMonthDate: Date,
    rent: IRent
  ): Promise<IRentMonth[] | []> {

	const day = lastMonthDate.getDate()
	const month = lastMonthDate.getMonth()
	const year = lastMonthDate.getFullYear()

	const lastDayMonth = new Date(year, month, 0).getDate()
	const safeDay = Math.min(day, lastDayMonth)
    const currentDate = new Date();
	const startDate = new Date(year, month, safeDay)
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), safeDay);
    const months = [];

	if (startDate.getMonth() == endDate.getMonth()) {
		return months
	}

    for (let date = new Date(startDate); date <= endDate; date.setMonth(date.getMonth() + 1)) {
      const createdMonth = await this.rentMonthRepository.create({
        dateMonth: new Date(date),
        rentId: rent.id,
      });

      if (rent.fixedExpenses && rent.fixedExpenses.length > 0) {
        for (const expense of rent.fixedExpenses) {
          await this.rentExpenseRepository.create({
            amount: expense.amount,
            reason: expense.reason,
            rentMonthId: createdMonth.id,
            userId: rent.userId,
          });
        }
      }

      months.push(createdMonth);
    }

    return months;
  }
}
