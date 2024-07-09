import mongoose from "mongoose";

import { v4 as uuidv4 } from "uuid";

export interface ICategory extends Document {
  _id: string;
  name: string;
  userId: string;
}

const categorySchema = new mongoose.Schema(
  {
    _id: {
      type: String,
      default: uuidv4
    },
    name: {
      type: String,
      required: true,
      unique: true
    }
  },
);

export const Category = mongoose.model("Category", categorySchema);
