import mongoose, { Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface ITransactionDocument extends Document {
  _id: string;
  type: "INCOME" | "EXPENSE";
  amount: number;
  dueDate: Date;
  isPaid: boolean;
  isRecurring: boolean;
  source: "MANUAL" | "RENT" | "FINANCING";
  description: string;
  walletId?: string;
  patrimonyId?: string;
  recurrenceRuleId?: string;
  userId: string;
}

const transactionSchema = new mongoose.Schema(
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
    dueDate: {
      type: Date,
      required: true,
    },
    isPaid: {
      type: Boolean,
      required: true,
      default: false,
    },
    isRecurring: {
      type: Boolean,
      required: true,
      default: false,
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
    walletId: {
      type: String,
      required: false,
    },
    patrimonyId: {
      type: String,
      required: false,
    },
    recurrenceRuleId: {
      type: String,
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

export const Transaction = mongoose.model<ITransactionDocument>(
  "Transaction",
  transactionSchema
);
