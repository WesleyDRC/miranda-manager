import mongoose, {Schema, model, Document} from "mongoose";

import { v4 as uuidv4 } from "uuid";

export interface IRentMonth extends Document {
	id: string,
	dateMonth: Date,
	amountPaid: number,
	paid: boolean,
	rentId: string
} 

const rentMonthSchema = new Schema({
	_id: {
		type: String,
		default: () => uuidv4()
	},
	dateMonth: {
		type: Date,
		required: true,
	},
	amountPaid: {
		type: Number,
		default: 0,
		required: true
	},
	paid: {
		type: Boolean,
		default: false,
		required: true,
	},
	receipts: [
		{
			type: String,
			ref: "RentReceipt"
		}
	],
	rentId: {
		type: String,
		ref: "Rent",
		required: true,
	}
})

export const RentMonth = model<IRentMonth>("RentMonth", rentMonthSchema)