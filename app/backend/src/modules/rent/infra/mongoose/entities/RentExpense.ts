
import mongoose from "mongoose";

import {v4 as uuidv4} from "uuid"

const rentExpenseSchema = new mongoose.Schema(
	{
		_id: {
			type: String,
			default: uuidv4
		},
		value: {
			type: Number,
			required: true
		},
		reason: {
			type: String,
			required: true
		},
		rentId: {
			type: String,
			required: true,
			ref: "Rent"
		}
	}
)

export const RentExpense = mongoose.model("RentExpense", rentExpenseSchema)