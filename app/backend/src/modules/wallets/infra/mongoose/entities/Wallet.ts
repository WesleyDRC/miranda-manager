import mongoose, { Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IWalletDocument extends Document {
  _id: string;
  name: string;
  balance: number;
  userId: string;
}

const walletSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4
    },
    name: {
      type: String,
      required: true
    },
    balance: {
      type: Number,
      required: true,
      default: 0
    },
    userId: {
      type: String,
      required: true
    }
  },
  {
    timestamps: true
  }
);

export const Wallet = mongoose.model<IWalletDocument>("Wallet", walletSchema);
