import mongoose, { Schema, model, Document } from "mongoose"

export interface IRent extends Document {
  id: string,
  startRental: string;
  userId: string;
  fixedExpenses?: { reason: string; amount: number }[];
}

const rentSchema = new Schema({
  _id: {
    type: String,
    required: true
  },
  startRental: {
    type: String,
    required: true
  },
  userId: {
    type: String,
    required: true
  },
  fixedExpenses: [{
    reason: { type: String, required: true },
    amount: { type: Number, required: true }
  }]
});

export const Rent = model<IRent>("Rent", rentSchema);
