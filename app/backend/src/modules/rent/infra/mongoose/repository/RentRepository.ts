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
}
