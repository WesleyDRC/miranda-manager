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
  rentId: {
    type: String,
    required: true,
    ref: "Rent",
  },
});

rentExpenseSchema.post("save", async function () {
  await updateNetIncome(this.rentId);
});

async function updateNetIncome(rentId) {
  const rentMonths = await RentMonth.find({ rentId }).where({paid:true});;
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

  await Rent.updateOne({ _id: rentId }, { netIncome: totalNetIncome });
}

export const RentExpense = mongoose.model("RentExpense", rentExpenseSchema);
