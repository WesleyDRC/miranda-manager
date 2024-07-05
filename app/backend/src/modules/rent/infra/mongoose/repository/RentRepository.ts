import { IStoreRentDTO } from "../../../dtos/IStoreRent";
import { IRent } from "../../../entities/IRent";
import { IRentRepository } from "../../../repositories/IRentRepository";
import { Rent } from "../entities/Rent";

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
}
