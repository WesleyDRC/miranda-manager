import mongoose, { Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface ITreasuryMovementDocument extends Document {
  _id: string;
  treasuryId: string;
  movementType: "DEPOSIT" | "WITHDRAW" | "ADJUSTMENT";
  amount: number;
  movementDate: Date;
  description: string;
  fixedRate?: number;
  indexerRate?: number;
  annualRate?: number;
}

const treasuryMovementSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    treasuryId: {
      type: String,
      required: true,
    },
    movementType: {
      type: String,
      enum: ["DEPOSIT", "WITHDRAW", "ADJUSTMENT"],
      required: true,
    },
    amount: {
      type: Number,
      required: true,
    },
    movementDate: {
      type: Date,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    fixedRate: {
      type: Number,
      required: false,
    },
    indexerRate: {
      type: Number,
      required: false,
    },
    annualRate: {
      type: Number,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
treasuryMovementSchema.index({ treasuryId: 1 });
treasuryMovementSchema.index({ movementDate: -1 });

export const TreasuryMovement = mongoose.model<ITreasuryMovementDocument>(
  "TreasuryMovement",
  treasuryMovementSchema
);
