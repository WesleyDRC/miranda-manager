import mongoose, { Document } from "mongoose";
import { v4 as uuidv4 } from "uuid";

export interface IPatrimonyDocument extends Document {
  _id: string;
  name: string;
  type: "VEHICLE" | "REAL_ESTATE" | "OTHER";
  marketValue: number;
  isFinanced: boolean;
  financingDetails?: {
    installmentValue: number;
    startDate: Date;
    endDate: Date;
    dueDateDay: number;
  };
  vehicleDetails?: {
    plate?: string;
    year?: string;
    ipvaValue?: number;
    ipvaPaid?: boolean;
    insuranceValue?: number;
    imageUrl?: string;
    ipvaReceiptUrl?: string;
    insurancePolicyUrl?: string;
    ipvaHistory?: {
      year: number;
      value: number;
      paid: boolean;
      receiptUrl?: string;
    }[];
    insuranceHistory?: {
      year: number;
      value: number;
      policyUrl?: string;
    }[];
  };
  realEstateDetails?: {
    imageUrl?: string;
  };
  userId: string;
}

const patrimonySchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4,
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ["VEHICLE", "REAL_ESTATE", "OTHER"],
      required: true,
    },
    marketValue: {
      type: Number,
      required: true,
    },
    isFinanced: {
      type: Boolean,
      required: true,
      default: false,
    },
    financingDetails: {
      installmentValue: { type: Number, required: false },
      startDate: { type: Date, required: false },
      endDate: { type: Date, required: false },
      dueDateDay: { type: Number, required: false },
    },
    vehicleDetails: {
      plate: { type: String },
      year: { type: String },
      ipvaValue: { type: Number },
      ipvaPaid: { type: Boolean },
      insuranceValue: { type: Number },
      imageUrl: { type: String },
      ipvaReceiptUrl: { type: String },
      insurancePolicyUrl: { type: String },
      ipvaHistory: [
        {
          year: { type: Number },
          value: { type: Number },
          paid: { type: Boolean },
          receiptUrl: { type: String },
        },
      ],
      insuranceHistory: [
        {
          year: { type: Number },
          value: { type: Number },
          policyUrl: { type: String },
        },
      ],
    },
    realEstateDetails: {
      imageUrl: { type: String },
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

export const Patrimony = mongoose.model<IPatrimonyDocument>("Patrimony", patrimonySchema);
