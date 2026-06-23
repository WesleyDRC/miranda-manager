import mongoose, { Document, Schema } from "mongoose";
import { v4 as uuidv4 } from "uuid";
import { MarketDataType, IMarketSnapshot } from "@/core/market-data/domain/entities/MarketSnapshot";

export interface IMarketSnapshotDocument extends Omit<IMarketSnapshot, "id">, Document {
  _id: string;
}

const MarketSnapshotSchema = new Schema(
  {
    _id: { type: String, default: uuidv4 },
    type: { type: String, required: true, enum: ["SELIC", "IPCA", "TREASURY", "IPCA_FOCUS"] },
    referenceDate: { type: Date, required: true },
    value: { type: Number, required: true },
    metadata: { type: Schema.Types.Mixed, required: false },
  },
  {
    timestamps: true,
  }
);

// Indexes to speed up queries by type and date
MarketSnapshotSchema.index({ type: 1, referenceDate: -1 });

export const MarketSnapshotModel = mongoose.model<IMarketSnapshotDocument>(
  "MarketSnapshot",
  MarketSnapshotSchema
);
