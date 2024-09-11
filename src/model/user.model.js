import mongoose, { model, Schema, Types } from "mongoose";
import bcrypt from "bcrypt";
const schema = new Schema(
  {
    name: String,
    email: String,
    password: String,
    isBlocked: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ["admin", "user"],
      default: "user",
    },
    passwordChangedAt: Date,
    wishlist: [{ type: Types.ObjectId, ref: "Product" }],
    addresses: [
      {
        city: String,
        phone: String,
        street: String,
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

schema.pre("save", function () {
  this.password = bcrypt.hashSync(this.password, 8);
});

schema.pre("findOneAndUpdate", function () {
  if (this._update.password)
    this._update.password = bcrypt.hashSync(this._update.password, 8);
});

export const User = model("User", schema);
