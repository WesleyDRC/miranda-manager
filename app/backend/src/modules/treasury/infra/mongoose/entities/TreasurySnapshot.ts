import mongoose, { Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface ITreasurySnapshotDocument extends Document {
  _id: string;
  treasuryId: string;
  snapshotDate: Date;
  currentValue: number;
  projectedValue: number;
}

const treasurySnapshotSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    treasuryId: {
      type: String,
      required: true,
    },
    snapshotDate: {
      type: Date,
      required: true,
    },
    currentValue: {
      type: Number,
      required: true,
    },
    projectedValue: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export const TreasurySnapshot = mongoose.model<ITreasurySnapshotDocument>(
  "TreasurySnapshot",
  treasurySnapshotSchema
);
