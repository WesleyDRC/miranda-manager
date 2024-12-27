import mongoose from "mongoose";

import { v4 as uuidv4 } from "uuid";

const rentReceiptSchema = new mongoose.Schema({
	_id: {
		type: String,
		default: uuidv4,
	},
	receipt: {
		type: String,
		required: false
	},
  rentMonthId: {
    type: String,
    ref: "RentMonth",
    required: true,
  },
});

export const RentReceipt = mongoose.model("RentReceipt", rentReceiptSchema);
