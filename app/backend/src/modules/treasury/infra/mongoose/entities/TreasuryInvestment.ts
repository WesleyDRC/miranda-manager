import mongoose, { Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface ITreasuryInvestmentDocument extends Document {
  _id: string;
  userId: string;
  treasuryType: "SELIC" | "PREFIXADO" | "PREFIXADO_JUROS" | "IPCA" | "IPCA_JUROS";
  titleName: string;
  purchaseDate: Date;
  maturityDate: Date;
  investedAmount: number;
  currentValue: number;
  projectedValue: number;
  annualRate: number;
  monthlyEstimatedRate: number;
  liquidityAvailable: boolean;
  quantity?: number;
  unitPrice?: number;
  marketUnitPrice?: number;
  marketValue?: number;
  notes?: string;
}

const treasuryInvestmentSchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    userId: {
      type: String,
      required: true,
    },
    treasuryType: {
      type: String,
      enum: ["SELIC", "PREFIXADO", "PREFIXADO_JUROS", "IPCA", "IPCA_JUROS"],
      required: true,
    },
    titleName: {
      type: String,
      required: true,
    },
    purchaseDate: {
      type: Date,
      required: true,
    },
    maturityDate: {
      type: Date,
      required: true,
    },
    investedAmount: {
      type: Number,
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
    annualRate: {
      type: Number,
      required: true,
    },
    monthlyEstimatedRate: {
      type: Number,
      required: true,
    },
    quantity: {
      type: Number,
      required: false,
    },
    unitPrice: {
      type: Number,
      required: false,
    },
    marketUnitPrice: {
      type: Number,
      required: false,
    },
    marketValue: {
      type: Number,
      required: false,
    },
    liquidityAvailable: {
      type: Boolean,
      required: true,
      default: true,
    },
    notes: {
      type: String,
      required: false,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes
treasuryInvestmentSchema.index({ userId: 1 });
treasuryInvestmentSchema.index({ maturityDate: 1 });
treasuryInvestmentSchema.index({ liquidityAvailable: 1 });

export const TreasuryInvestment = mongoose.model<ITreasuryInvestmentDocument>(
  "TreasuryInvestment",
  treasuryInvestmentSchema
);
