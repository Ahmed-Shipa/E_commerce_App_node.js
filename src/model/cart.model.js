import mongoose, { model, Schema, Types } from "mongoose";

const schema = new Schema(
  {
    user: {
      type: Types.ObjectId,
      ref: "User",
    },
    cartItems: [
      {
        product: {
          type: Types.ObjectId,
          ref: "User",
        },
        quantity: {
          type: Number,
          default: 1,
        },
        price: Number,
      },
    ],
    totalCartPrice: Number,
    discount: Number,
    totalCartPriceAfterDiscount: Number,
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

export const Cart = model("Cart", schema);
