import mongoose, { Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IRecurrenceRuleDocument extends Document {
  _id: string;
  type: "INCOME" | "EXPENSE";
  amount: number;
  dayOfMonth: number;
  source: "MANUAL" | "RENT" | "FINANCING";
  description: string;
  startDate: Date;
  endDate?: Date;
  userId: string;
}

const recurrenceRuleSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    type: {
      type: String,
      enum: ["INCOME", "EXPENSE"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    dayOfMonth: {
      type: Number,
      required: true,
    },
    source: {
      type: String,
      enum: ["MANUAL", "RENT", "FINANCING"],
      required: true,
      default: "MANUAL",
    },
    description: {
      type: String,
      required: true,
    },
    startDate: {
      type: Date,
      required: true,
    },
    endDate: {
      type: Date,
      required: false,
    },
    userId: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const RecurrenceRule = mongoose.model<IRecurrenceRuleDocument>(
  "RecurrenceRule",
  recurrenceRuleSchema
);
