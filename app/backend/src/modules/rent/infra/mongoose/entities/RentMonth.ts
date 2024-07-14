import mongoose from "mongoose";

import { v4 as uuidv4 } from "uuid";

import { Rent } from "./Rent";

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
	await updateGrossIncome(doc.rentId);
});

rentMonthSchema.post("findOneAndUpdate", async function (doc) {
	if (doc) {
			await updateGrossIncome(doc.rentId);
	}
});

rentMonthSchema.pre("save", async function (next) {
	if (this.isModified("amountPaid")) {
			await updateGrossIncome(this.rentId);
	}
	next();
});

async function updateGrossIncome(rentId) {
  const rentMonths = await RentMonth.find({ rentId });
  const totalGrossIncome = rentMonths.reduce(
    (total, rentMonth) => total + rentMonth.amountPaid,
    0
  );

  await Rent.updateOne({ _id: rentId }, { grossIncome: totalGrossIncome });
}

export const RentMonth = mongoose.model("RentMonth", rentMonthSchema);
