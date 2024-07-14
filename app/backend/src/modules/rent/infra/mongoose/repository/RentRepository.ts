import { IStoreRentDTO } from "../../../dtos/IStoreRentDTO";
import { IStoreRentMonthDTO } from "../../../dtos/IStoreRentMonthDTO";
import { IRent } from "../../../entities/IRent";
import { IRentMonth } from "../../../entities/IRentMonth";
import { IRentRepository } from "../../../repositories/IRentRepository";

import { Rent } from "../entities/Rent";
import { RentMonth } from "../entities/RentMonth";

export class RentRepository implements IRentRepository {
  async create(rent: IStoreRentDTO): Promise<IRent> {
    const rentalCreated = await Rent.create({
      name: rent.name,
      value: rent.value,
      street: rent.street,
      streetNumber: rent.streetNumber,
      startRental: rent.startRental,
      userId: rent.userId
    });

    const rental = {
      id: rentalCreated._id,
      name: rentalCreated.name,
      value: rentalCreated.value,
      street: rentalCreated.street,
      streetNumber: rentalCreated.streetNumber,
      startRental: rentalCreated.startRental,
      userId: rentalCreated.userId,
    };

    return rental;
  }

  async createRentMonth(rentMonth: IStoreRentMonthDTO): Promise<IRentMonth>{
    const rentMonthCreated = await RentMonth.create({
      month: rentMonth.month,
      paid: rentMonth.paid,
      rentId: rentMonth.rentId
		})

		const rent: IRentMonth = {
			id: rentMonthCreated._id,
      month: rentMonthCreated.month,
      paid: rentMonthCreated.paid,
      rentId: rentMonthCreated.rentId
		}

		return rent
  }

  async findById(id: string, userId: string): Promise<IRent> {
    const rentFound = await Rent.findOne({
			_id: id,
			userId
		})

		if(!rentFound) {
			return null
		}

    const rentMonths = await this.findRentMonthById(id)

    const months = rentMonths.map((month) => {
      return {
        month: month.month, 
        paid: month.paid
      };
    });
    
		const rent: IRent = {
			id: rentFound._id,
			name: rentFound.name,
      value: rentFound.value,
      street: rentFound.street,
      streetNumber: rentFound.streetNumber,
      startRental: rentFound.startRental,
      months: months,
      userId: rentFound.userId
		}

		return rent
  }

  async findRentMonthById(rentId: string) {
    const rentMonthFound = await RentMonth.find({ rentId })

    return rentMonthFound
  }
}
