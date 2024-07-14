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
      dateMonth: rentMonth.month,
      amountPaid: rentMonth.amountPaid,
      paid: rentMonth.paid,
      rentId: rentMonth.rentId
		})

		const rent: IRentMonth = {
			id: rentMonthCreated._id,
      dateMonth: rentMonthCreated.dateMonth,
      amountPaid: rentMonthCreated.amountPaid,
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
    
		const rent: IRent = {
			id: rentFound._id,
			name: rentFound.name,
      value: rentFound.value,
      street: rentFound.street,
      streetNumber: rentFound.streetNumber,
      startRental: rentFound.startRental,
      userId: rentFound.userId
		}

		return rent
  }

  async findAllRentMonthById(rentId: string): Promise<IRentMonth[]> {
    const rentMonthFound = await RentMonth.find({ rentId })

    const rentMonths: IRentMonth[] = rentMonthFound.map((rentMonth) => {
      return {
        id: rentMonth._id,
        dateMonth: rentMonth.dateMonth,
        amountPaid: rentMonth.amountPaid,
        paid: rentMonth.paid,
        rentId: rentMonth.rentId
      }
    })

    return rentMonths
  }
}
