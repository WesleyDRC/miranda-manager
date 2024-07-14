import mongoose from "mongoose";

import {v4 as uuidv4} from "uuid"

const rentMonthSchema = new mongoose.Schema(
	{
		_id: {
			type: String,
			default: uuidv4
		},
		dateMonth: {
			type: Date,
			required: true,
		},
		amountPaid: {
			type: Number,
			default: 0
		},
		paid: {
			type: Boolean,
			default: false,
			required: true
		},
		rentId: {
			type: String,
			ref: "Rent",
			required: true
		}
	}
)

export const RentMonth = mongoose.model("RentMonth", rentMonthSchema)