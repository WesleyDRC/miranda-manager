import { IStoreRentDTO } from "@/modules/rent/dtos/IStoreRentDTO";
import { IStoreRentExpenseDTO } from "@/modules/rent/dtos/IStoreRentExpenseDTO";
import { IStoreRentMonthDTO } from "@/modules/rent/dtos/IStoreRentMonthDTO";
import { IStoreRentReceiptDTO } from "@/modules/rent/dtos/IStoreRentReceiptDTO";
import { IRent } from "@/modules/rent/entities/IRent";
import { IRentExpense } from "@/modules/rent/entities/IRentExpense";
import { IRentMonth } from "@/modules/rent/entities/IRentMonth";
import { IRentReceipt } from "@/modules/rent/entities/IRentReceipt";
import { IRentRepository } from "@/modules/rent/repositories/IRentRepository";

import { Rent } from "@/modules/rent/infra/mongoose/entities/Rent";
import { RentExpense } from "@/modules/rent/infra/mongoose/entities/RentExpense";
import { RentMonth } from "@/modules/rent/infra/mongoose/entities/RentMonth";
import { RentReceipt } from "@/modules/rent/infra/mongoose/entities/RentReceipts"
import { RentPayment } from "@/modules/rent/infra/mongoose/entities/RentPayment";

export class RentRepository implements IRentRepository {
  async create(rent: IStoreRentDTO): Promise<IRent> {
    const rentalCreated = await Rent.create({
      tenant: rent.tenant,
      value: rent.value,
      street: rent.street,
      streetNumber: rent.streetNumber,
      startRental: rent.startRental,
      userId: rent.userId,
    });

    const rental = {
      id: rentalCreated._id,
      tenant: rentalCreated.tenant,
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

  async findById({ id, userId }): Promise<IRent> {
    const rentFound = await Rent.findOne({
      _id: id,
      userId,
    });

    if (!rentFound) {
      return null;
    }

    const rent: IRent = {
      id: rentFound._id,
      tenant: rentFound.tenant,
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

  async findRentMonthById({ id }): Promise<IRentMonth> {
    const rentMonthFound = await RentMonth.findOne({
      _id: id,
    });

    if (!rentMonthFound) {
      return null;
    }

    const rentMonth: IRentMonth = {
      id: rentMonthFound._id,
      dateMonth: rentMonthFound.dateMonth,
      amountPaid: rentMonthFound.amountPaid,
      paid: rentMonthFound.paid,
      rentId: rentMonthFound.rentId,
    };

    return rentMonth;
  }

  async findAllRentMonthByRentId(rentId: string): Promise<IRentMonth[]> {
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

  async updateRentMonth(
    rentMonthId: string,
    rentId: string,
    updates: any
  ): Promise<IRentMonth> {
    const updatedRentMonth = await RentMonth.findOneAndUpdate(
      { _id: rentMonthId, rentId },
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

  async createRentExpense(
    rentExpense: IStoreRentExpenseDTO
  ): Promise<IRentExpense> {
    const rentExpenseCreated = await RentExpense.create({
      amount: rentExpense.amount,
      reason: rentExpense.reason,
      rentMonthId: rentExpense.rentMonthId,
      userId: rentExpense.userId,
    });

    const rent: IRentExpense = {
      id: rentExpenseCreated._id,
      amount: rentExpenseCreated.amount,
      reason: rentExpenseCreated.reason,
      rentMonthId: rentExpenseCreated.rentMonthId,
      userId: rentExpense.userId,
    };

    return rent;
  }

  async findRentExpenses(rentMonthId: string): Promise<IRentExpense[]> {
    const rentExpenseFound = await RentExpense.find({ rentMonthId });

    const rentExpenses: IRentExpense[] = rentExpenseFound.map((rentExpense) => {
      return {
        id: rentExpense._id,
        amount: rentExpense.amount,
        reason: rentExpense.reason,
        rentMonthId: rentExpense.rentMonthId,
        userId: rentExpense.userId,
      };
    });

    return rentExpenses;
  }

  async findRentExpenseById(
    rentExpenseId: string,
    userId: string
  ): Promise<IRentExpense> {
    const rentExpense = await RentExpense.findOne({
      _id: rentExpenseId,
      userId,
    });

    if (!rentExpense) {
      return null;
    }

    return {
      id: rentExpense._id,
      amount: rentExpense.amount,
      reason: rentExpense.reason,
      rentMonthId: rentExpense.rentMonthId,
      userId: rentExpense.userId,
    };
  }

  async updateRentExpense(
    rentExpenseId: string,
    userId: string,
    updates: any
  ): Promise<IRentExpense> {
    const updatedRentExpense = await RentExpense.findOneAndUpdate(
      { _id: rentExpenseId, userId },
      updates,
      { new: true, runValidators: true }
    );

    return {
      id: updatedRentExpense._id,
      amount: updatedRentExpense.amount,
      reason: updatedRentExpense.reason,
      rentMonthId: updatedRentExpense.rentMonthId,
      userId: updatedRentExpense.userId,
    };
  }

  async deleteRentExpense(
    rentExpenseId: string,
    userId: string
  ): Promise<boolean> {
    const wasDeleted = await RentExpense.findOneAndDelete({
      _id: rentExpenseId,
      userId,
    });

    return wasDeleted ? true : false;
  }

  async createRentReceipt(
    rentReceipt: IStoreRentReceiptDTO
  ): Promise<IRentReceipt> {

    const receiptCreated = await RentReceipt.create({
      receipt: rentReceipt.receipt,
      rentMonthId: rentReceipt.rentMonthId
    })

    const receipt: IRentReceipt = {
      id: receiptCreated._id,
      receipt: receiptCreated.receipt,
      rentMonthId: receiptCreated.rentMonthId
    }

    return receipt
  }

  async findRentReceipts(rentMonthId: string): Promise<IRentReceipt[]> {
    const rentReceiptsFound = await RentReceipt.find({ rentMonthId });

    const rentReceipts: IRentReceipt[] = rentReceiptsFound.map((rentReceipt) => {
      return {
        id: rentReceipt._id,
        receipt: rentReceipt.receipt,
        rentMonthId: rentReceipt.rentMonthId
      };
    });

    return rentReceipts;
  }

  async deleteRentReceipt(id: string): Promise<boolean> {
    const wasDeleted = await RentReceipt.findByIdAndDelete(id);
    return wasDeleted ? true : false;
  }

  async findRentReceiptById(id: string): Promise<IRentReceipt | null> {
    const rentReceipt = await RentReceipt.findById(id);
    if (!rentReceipt) return null;
    return {
      id: rentReceipt._id,
      receipt: rentReceipt.receipt,
      rentMonthId: rentReceipt.rentMonthId
    };
  }

  async createRentPayment(rentPayment: any): Promise<any> {
    const rentPaymentCreated = await RentPayment.create({
      amount: rentPayment.amount,
      paymentDate: rentPayment.paymentDate,
      rentMonthId: rentPayment.rentMonthId,
      userId: rentPayment.userId,
    });

    return {
      id: rentPaymentCreated._id,
      amount: rentPaymentCreated.amount,
      paymentDate: rentPaymentCreated.paymentDate,
      rentMonthId: rentPaymentCreated.rentMonthId,
      userId: rentPaymentCreated.userId,
    };
  }

  async findRentPayments(rentMonthId: string): Promise<any[]> {
    const paymentsFound = await RentPayment.find({ rentMonthId });
    return paymentsFound.map((payment) => ({
      id: payment._id,
      amount: payment.amount,
      paymentDate: payment.paymentDate,
      rentMonthId: payment.rentMonthId,
      userId: payment.userId,
    }));
  }

  async deleteRentPayment(rentPaymentId: string, userId: string): Promise<boolean> {
    const wasDeleted = await RentPayment.findOneAndDelete({
      _id: rentPaymentId,
      userId,
    });
    return wasDeleted ? true : false;
  }

  async findAll(userId: string): Promise<IRent[]> {
    const rentsFound = await Rent.find({ userId });
    return rentsFound.map((rentFound) => ({
      id: rentFound._id,
      tenant: rentFound.tenant,
      value: rentFound.value,
      street: rentFound.street,
      streetNumber: rentFound.streetNumber,
      startRental: rentFound.startRental,
      grossIncome: rentFound.grossIncome,
      netIncome: rentFound.netIncome,
      userId: rentFound.userId,
      observations: rentFound.observations,
    }));
  }

  async update(id: string, userId: string, updates: any): Promise<IRent | null> {
    const updatedRent = await Rent.findOneAndUpdate(
      { _id: id, userId },
      updates,
      { new: true, runValidators: true }
    );

    if (!updatedRent) {
      return null;
    }

    return {
      id: updatedRent._id,
      tenant: updatedRent.tenant,
      value: updatedRent.value,
      street: updatedRent.street,
      streetNumber: updatedRent.streetNumber,
      startRental: updatedRent.startRental,
      grossIncome: updatedRent.grossIncome,
      netIncome: updatedRent.netIncome,
      userId: updatedRent.userId,
      observations: updatedRent.observations,
    };
  }

  async findRentPaymentsByMonthIds(monthIds: string[]): Promise<any[]> {
    const paymentsFound = await RentPayment.find({ rentMonthId: { $in: monthIds } });
    return paymentsFound.map((payment) => ({
      id: payment._id,
      amount: payment.amount,
      paymentDate: payment.paymentDate,
      rentMonthId: payment.rentMonthId,
      userId: payment.userId,
    }));
  }

  async findRentExpensesByMonthIds(monthIds: string[]): Promise<IRentExpense[]> {
    const expensesFound = await RentExpense.find({ rentMonthId: { $in: monthIds } });
    return expensesFound.map((expense) => ({
      id: expense._id,
      amount: expense.amount,
      reason: expense.reason,
      rentMonthId: expense.rentMonthId,
      userId: expense.userId,
    }));
  }

  async findRentReceiptsByMonthIds(monthIds: string[]): Promise<IRentReceipt[]> {
    const receiptsFound = await RentReceipt.find({ rentMonthId: { $in: monthIds } });
    return receiptsFound.map((receipt) => ({
      id: receipt._id,
      receipt: receipt.receipt,
      rentMonthId: receipt.rentMonthId,
    }));
  }
}
