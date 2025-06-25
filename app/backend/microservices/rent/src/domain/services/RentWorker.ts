import { IRentRepository } from "../../modules/rent/repository/IRentRepository";
import { IRentMonthRepository } from "../../modules/rent-month/repository/IRentMonthRepository";
import { IRentMonth } from "../../modules/rent-month/entities/IRentMonth";

export class RentWorker {
	constructor(
		private rentRepository: IRentRepository,
		private rentMonthRepository: IRentMonthRepository
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

			const months = await this.createRentMonthIfNeeded(lastMonthDate, rent.id);

			console.log(`Total Months created ${months.length}`)

		}

		return rents
	}

	private async createRentMonthIfNeeded(
    lastMonthDate: Date,
    rentId: string
  ): Promise<IRentMonth[] | []> {
		
		const day = lastMonthDate.getDate()
		const month = lastMonthDate.getMonth()
		const year = lastMonthDate.getFullYear()

    const currentDate = new Date();
		const startDate = new Date(year, month, day)
    const endDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
    const months = [];

		if (startDate.getMonth() == endDate.getMonth()) {
			return months
		}
  
    for (let date = new Date(startDate); date <= endDate; date.setMonth(date.getMonth() + 1)) {
      months.push(
        await this.rentMonthRepository.create({
          dateMonth: new Date(date), 
          rentId: rentId,
        })
      );
    }

    return months;
  }
}