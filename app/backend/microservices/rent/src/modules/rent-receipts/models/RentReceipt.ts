import mongoose, {Schema, model, Document} from "mongoose";

import { v4 as uuidv4 } from "uuid";

export interface IRentReceipt extends Document {
	id: string,
	receipt: string,
	rentMonthId: string
}

const rentReceiptSchema = new Schema({
	_id: {
		type: String,
		default: uuidv4()
	},
	receipt: {
		type: String,
		required: true,
	},
	amountPaid: {
		type: Number,
		default: 0,
		required: true
	},
	rentMonthId: {
		type: String,
		ref: "Rent",
		required: true,
	}
})

export const RentReceipt = model<IRentReceipt>("RentReceipt", rentReceiptSchema)