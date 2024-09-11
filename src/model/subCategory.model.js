import mongoose, { model, Schema, Types } from "mongoose";

const schema = new Schema(
  {
    name: {
      type: String,
      minLength: [2, "too short subCategory name"],
      required: true,
      trim: true,
      unique: [true, "name is required"],
    },
    category: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
    },
    slug: {
      type: String,
      lowerCase: true,
      required: true,
    },
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const SubCategory = model("SubCategory", schema);
