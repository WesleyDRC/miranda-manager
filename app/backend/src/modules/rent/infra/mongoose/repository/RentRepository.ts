import { IStoreRentDTO } from "../../../dtos/IStoreRentDTO";
import { IStoreRentExpenseDTO } from "../../../dtos/IStoreRentExpenseDTO";
import { IStoreRentMonthDTO } from "../../../dtos/IStoreRentMonthDTO";
import { IRent } from "../../../entities/IRent";
import { IRentExpense } from "../../../entities/IRentExpense";
import { IRentMonth } from "../../../entities/IRentMonth";
import { IRentRepository } from "../../../repositories/IRentRepository";

import { Rent } from "../entities/Rent";
import { RentExpense } from "../entities/RentExpense";
import { RentMonth } from "../entities/RentMonth";

export class RentRepository implements IRentRepository {
  async create(rent: IStoreRentDTO): Promise<IRent> {
    const rentalCreated = await Rent.create({
      name: rent.name,
      value: rent.value,
      street: rent.street,
      streetNumber: rent.streetNumber,
      startRental: rent.startRental,
      userId: rent.userId,
    });

    const rental = {
      id: rentalCreated._id,
      name: rentalCreated.name,
      value: rentalCreated.value,
      street: rentalCreated.street,
      streetNumber: rentalCreated.streetNumber,
      startRental: rentalCreated.startRental,
      grossIncome: rentalCreated.grossIncome,
      netIncome: rentalCreated.netIncome,
      userId: rentalCreated.userId,
    };

    return rental;
  }

  async createRentMonth(rentMonth: IStoreRentMonthDTO): Promise<IRentMonth> {
    const rentMonthCreated = await RentMonth.create({
      dateMonth: rentMonth.month,
      amountPaid: rentMonth.amountPaid,
      paid: rentMonth.paid,
      rentId: rentMonth.rentId,
    });

    const rent: IRentMonth = {
      id: rentMonthCreated._id,
      dateMonth: rentMonthCreated.dateMonth,
      amountPaid: rentMonthCreated.amountPaid,
      paid: rentMonthCreated.paid,
      rentId: rentMonthCreated.rentId,
    };

    return rent;
  }

  async findById({id, userId}): Promise<IRent> {
    const rentFound = await Rent.findOne({
      _id: id,
      userId,
    });

    if (!rentFound) {
      return null;
    }

    const rent: IRent = {
      id: rentFound._id,
      name: rentFound.name,
      value: rentFound.value,
      street: rentFound.street,
      streetNumber: rentFound.streetNumber,
      startRental: rentFound.startRental,
      grossIncome: rentFound.grossIncome,
      netIncome: rentFound.netIncome,
      userId: rentFound.userId,
    };

    return rent;
  }

  async findAllRentMonthById(rentId: string): Promise<IRentMonth[]> {
    const rentMonthFound = await RentMonth.find({ rentId });

    const rentMonths: IRentMonth[] = rentMonthFound.map((rentMonth) => {
      return {
        id: rentMonth._id,
        dateMonth: rentMonth.dateMonth,
        amountPaid: rentMonth.amountPaid,
        paid: rentMonth.paid,
        rentId: rentMonth.rentId,
      };
    });

    return rentMonths;
  }

  async updateRent(id, updates) {
    const updatedRent = await Rent.findByIdAndUpdate(id, updates, {
      new: true,
      runValidators: true,
    });
    return updatedRent;
  }

  async updateRentMonth(rentId, updates) {
    const updatedRentMonth = await RentMonth.findOneAndUpdate(
      { rentId },
      updates,
      { new: true, runValidators: true }
    );
    return updatedRentMonth;
  }
  
  async createRentExpense(rentExpense: IStoreRentExpenseDTO): Promise<IRentExpense> {
    const rentExpenseCreated = await RentExpense.create({
      value: rentExpense.value,
      reason: rentExpense.reason,
      rentId: rentExpense.rentId,
    });

    const rent: IRentExpense = {
      id: rentExpenseCreated._id,
      value: rentExpenseCreated.value,
      reason: rentExpenseCreated.reason,
      rentId: rentExpenseCreated.rentId,
    };

    return rent;
  }
}
