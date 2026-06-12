import mongoose, { Schema, model, Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IRentExpense extends Document {
  id: string;
  amount: number;
  reason: string;
  rentMonthId: string;
  userId: string;
}

const rentExpenseSchema = new Schema({
  _id: {
    type: String,
    default: () => uuidv4(),
  },
  amount: {
    type: Number,
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  rentMonthId: {
    type: String,
    required: true,
    ref: "Rent",
  },
  userId: {
    type: String,
    require: true,
    ref: "User",
  },
});

export const RentExpense = model<IRentExpense>("RentExpense", rentExpenseSchema);
