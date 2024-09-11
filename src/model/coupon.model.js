import mongoose, { model, Schema, Types } from "mongoose";

const schema = new Schema(
  {
    code: {
      type: String,
      required: true,
    },
    expires: Date,
    discount: Number,
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const Coupon = model("Coupon", schema);
