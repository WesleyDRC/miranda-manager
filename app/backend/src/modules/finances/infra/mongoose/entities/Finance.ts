import mongoose from "mongoose";

import { v4 as uuidv4 } from "uuid";

import { IRent } from "../../../../rent/entities/IRent";
import { ICategory } from "../../../../category/entities/ICategory";

interface IFinance extends Document {
  _id: string;
  name: string;
  categoryId: ICategory;
  rentId: IRent;
  userId: string;
}

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
			ref: "Rent"
    },
    userId: {
      type: String,
			required: true,
			ref: "User"
    }
  },
);

export const Finance = mongoose.model<IFinance>("Finance", financeSchema);
