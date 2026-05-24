import mongoose from "mongoose";

import { v4 as uuidv4 } from "uuid";

import { RentMonth } from "./RentMonth";
import { Rent } from "./Rent";

const rentPaymentSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: uuidv4,
  },
  amount: {
    type: Number,
    required: true,
  },
  paymentDate: {
    type: Date,
    required: true,
  },
  rentMonthId: {
    type: String,
    required: true,
    ref: "RentMonth",
  },
  userId: {
    type: String,
    require: true,
    ref: "User",
  },
});

rentPaymentSchema.post("save", async function () {
  await updateRentMonthAmountPaid(this.rentMonthId);
});

rentPaymentSchema.post("findOneAndUpdate", async function (doc) {
  if(doc) {
    await updateRentMonthAmountPaid(doc.rentMonthId);
  }
});

rentPaymentSchema.post("findOneAndDelete", async function (doc) {
  if(doc) {
    await updateRentMonthAmountPaid(doc.rentMonthId);
  }
});

async function updateRentMonthAmountPaid(rentMonthId: string) {
  const rentPayments = await RentPayment.find({ rentMonthId });
  const totalAmountPaid = rentPayments.reduce(
    (total, payment) => total + payment.amount,
    0
  );

  const rentMonth = await RentMonth.findById(rentMonthId);
  if (!rentMonth) return;

  const rent = await Rent.findById(rentMonth.rentId);
  if (!rent) return;

  const rentValue = parseFloat(rent.value) || 0;
  const isPaid = totalAmountPaid >= rentValue;

  rentMonth.amountPaid = totalAmountPaid;
  rentMonth.paid = isPaid;
  await rentMonth.save(); 
}

export const RentPayment = mongoose.model("RentPayment", rentPaymentSchema);
