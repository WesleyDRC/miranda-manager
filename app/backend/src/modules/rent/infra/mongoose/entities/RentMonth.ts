import mongoose from "mongoose";

import { v4 as uuidv4 } from "uuid";

import { Rent } from "./Rent";
import { RentExpense } from "./RentExpense";

const rentMonthSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4,
  },
  dateMonth: {
    type: Date,
    required: true,
  },
  amountPaid: {
    type: Number,
    default: 0,
    required: true,
  },
  paid: {
    type: Boolean,
    default: false,
    required: true,
  },
  rentId: {
    type: String,
    ref: "Rent",
    required: true,
  },
});

rentMonthSchema.post("save", async function (doc) {
  await updateEarnings(doc.rentId);
});

rentMonthSchema.post("findOneAndUpdate", async function (doc) {
  await updateEarnings(doc.rentId);
});

async function updateEarnings(rentId) {
  const rentMonths = await RentMonth.find({ rentId }).where({paid:true});
  const rentExpenses = await RentExpense.find({ rentId });

  const totalGrossIncome = rentMonths.reduce(
    (total, rentMonth) => total + rentMonth.amountPaid,
    0
  );

  const totalExpenseAmount = rentExpenses.reduce(
    (total, rentExpenseAmount) => total + rentExpenseAmount.amount,
    0
  );

  const totalNetIncome = totalGrossIncome - totalExpenseAmount;

  await Rent.updateOne(
    { _id: rentId },
    { grossIncome: totalGrossIncome, netIncome: totalNetIncome }
  );
}

export const RentMonth = mongoose.model("RentMonth", rentMonthSchema);
