import mongoose, { Schema, model, Document } from "mongoose"

export interface IRent extends Document {
  id: string,
  startRental: string;
  userId: string
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
  }
});

export const Rent = model<IRent>("Rent", rentSchema);
