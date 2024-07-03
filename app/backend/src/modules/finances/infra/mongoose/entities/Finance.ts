import mongoose from "mongoose";

import { v4 as uuidv4 } from "uuid";

const financeSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4
    },
    name: {
      type: String,
      required: true,
      unique: true
    },
		categoryId: {
			type: String,
			required: true,
			ref: "Category"
		},
    rentId: {
      type: String,
			ref: "Rents"
    },
    userId: {
      type: String,
			required: true,
			ref: "User"
    }
  },
);

export const Finance = mongoose.model("Finance", financeSchema);
