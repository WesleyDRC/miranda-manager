import mongoose from "mongoose";

import {v4 as uuidv4} from "uuid"

const rentSchema = new mongoose.Schema(
	{
		_id: {
			type: String,
			default: uuidv4
		},
		name: {
			type: String,
			require: true
		},
		value: {
			type: String,
			require: true
		},
		street: {
			type: String,
			require: true
		},
		streetNumber: {
			type: String,
			require: true
		},
		startRental: {
			type: String,
			require: true
		},
		userId: {
			type: String,
			require: true,
			ref: "User"
		}
	}
)

export const Rent = mongoose.model("Rent", rentSchema)