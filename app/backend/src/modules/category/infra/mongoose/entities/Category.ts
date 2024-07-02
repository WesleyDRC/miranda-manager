import mongoose from "mongoose";

import { v4 as uuidv4 } from "uuid";

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
    },
    userId: {
      type: String,
      required: true,
			ref: "User"
    },
  },
);

export const Category = mongoose.model("Category", categorySchema);
