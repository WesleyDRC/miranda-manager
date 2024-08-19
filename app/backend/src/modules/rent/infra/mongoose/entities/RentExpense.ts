import mongoose from "mongoose";

import { v4 as uuidv4 } from "uuid";

import { Rent } from "./Rent";
import { RentMonth } from "./RentMonth";

const rentExpenseSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4,
  },
  amount: {
    type: Number,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  rentMonthId: {
    type: String,
    required: true,
    ref: "Rent",
  },
  userId: {
    type: String,
    require: true,
    ref: "User",
  },
});

rentExpenseSchema.post("save", async function () {
  await updateNetIncome(this.rentMonthId);
});

rentExpenseSchema.post("findOneAndUpdate", async function (doc) {
  await updateNetIncome(doc.rentMonthId);
});

rentExpenseSchema.post("findOneAndDelete", async function (doc) {
  await updateNetIncome(doc.rentMonthId);
});

async function updateNetIncome(rentMonthId: string) {
  const rentId = (await RentMonth.findById(rentMonthId)).rentId;

  const rentMonths = await RentMonth.find({ rentId: rentId }).where({
    paid: true,
  });

  const rentExpenses = await RentExpense.find({ rentMonthId });

  const totalGrossIncome = rentMonths.reduce(
    (total, rentMonth) => total + rentMonth.amountPaid,
    0
  );

  const totalExpenseAmount = rentExpenses.reduce(
    (total, rentExpenseAmount) => total + rentExpenseAmount.amount,
    0
  );

  const totalNetIncome = totalGrossIncome - totalExpenseAmount;

  await Rent.updateOne({ _id: rentId }, { netIncome: totalNetIncome });
}

export const RentExpense = mongoose.model("RentExpense", rentExpenseSchema);
