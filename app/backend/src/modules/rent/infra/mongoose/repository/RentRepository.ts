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
      dateMonth: rentMonth.dateMonth,
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

  async updateRentMonth(rentMonthid: string, rentId, updates): Promise<IRentMonth> {
    const updatedRentMonth = await RentMonth.findOneAndUpdate(
      { _id: rentMonthid, rentId },
      updates,
      { new: true, runValidators: true }
    );

    const rentMonth: IRentMonth = {
      id: updatedRentMonth._id,
      dateMonth: updatedRentMonth.dateMonth,
      amountPaid: updatedRentMonth.amountPaid,
      paid: updatedRentMonth.paid,
      rentId: updatedRentMonth.rentId,
    };

    return rentMonth;
  }
  
  async createRentExpense(rentExpense: IStoreRentExpenseDTO): Promise<IRentExpense> {
    const rentExpenseCreated = await RentExpense.create({
      amount: rentExpense.amount,
      reason: rentExpense.reason,
      rentId: rentExpense.rentId,
    });

    const rent: IRentExpense = {
      id: rentExpenseCreated._id,
      amount: rentExpenseCreated.amount,
      reason: rentExpenseCreated.reason,
      rentId: rentExpenseCreated.rentId,
    };

    return rent;
  }

  async findRentExpenses(rentId: string): Promise<IRentExpense[]> {
    const rentExpenseFound = await RentExpense.find({ rentId });

    const rentExpenses: IRentExpense[] = rentExpenseFound.map((rentExpense) => {
      return {
        id: rentExpense._id,
        amount: rentExpense.amount,
        reason: rentExpense.reason,
        rentId: rentExpense.rentId
      };
    });

    return rentExpenses;
  }
}
