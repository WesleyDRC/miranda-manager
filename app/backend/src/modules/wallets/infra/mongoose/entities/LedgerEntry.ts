import mongoose, { Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface ILedgerEntryDocument extends Document {
  _id: string;
  walletId: string;
  transactionId?: string;
  type: "CREDIT" | "DEBIT";
  amount: number;
  description: string;
  createdAt: Date;
}

const ledgerEntrySchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    walletId: {
      type: String,
      required: true,
    },
    transactionId: {
      type: String,
      required: false,
    },
    type: {
      type: String,
      enum: ["CREDIT", "DEBIT"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const LedgerEntry = mongoose.model<ILedgerEntryDocument>(
  "LedgerEntry",
  ledgerEntrySchema
);
