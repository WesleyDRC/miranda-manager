import mongoose from "mongoose";

import {v4 as uuidv4} from "uuid"

const rentMonthSchema = new mongoose.Schema(
	{
		_id: {
			type: String,
			default: uuidv4
		},
		month: {
			type: String,
			require: true,
		},
		paid: {
			type: Boolean,
			default: false,
			require: true
		},
		rentId: {
			type: String,
			ref: "Rent",
			require: true
		}
	}
)

export const RentMonth = mongoose.model("RentMonth", rentMonthSchema)