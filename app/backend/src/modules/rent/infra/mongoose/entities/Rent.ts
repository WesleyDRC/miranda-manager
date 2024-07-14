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
				required: true
			},
			value: {
				type: String,
				required: true
			},
			street: {
				type: String,
				required: true
			},
			streetNumber: {
				type: String,
				required: true
			},
			startRental: {
				type: String,
				required: true
			},
			userId: {
				type: String,
				required: true,
				ref: "User"
			}
		}
	)

	export const Rent = mongoose.model("Rent", rentSchema)