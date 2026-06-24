import mongoose, { Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface ITreasuryProductDocument extends Document {
  _id: string;
  name: string;
  treasuryType: "SELIC" | "PREFIXADO" | "PREFIXADO_JUROS" | "IPCA" | "IPCA_JUROS";
  maturityDate: Date;
  userId?: string; // Optional: se não houver userId, é um título global/padrão
}

const treasuryProductSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    name: {
      type: String,
      required: true,
    },
    treasuryType: {
      type: String,
      enum: ["SELIC", "PREFIXADO", "PREFIXADO_JUROS", "IPCA", "IPCA_JUROS"],
      required: true,
    },
    maturityDate: {
      type: Date,
      required: true,
    },
    userId: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
treasuryProductSchema.index({ userId: 1 });
treasuryProductSchema.index({ name: 1 });

export const TreasuryProduct = mongoose.model<ITreasuryProductDocument>(
  "TreasuryProduct",
  treasuryProductSchema
);
