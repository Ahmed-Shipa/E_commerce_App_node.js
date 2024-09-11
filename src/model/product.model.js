import mongoose, { model, Schema, Types } from "mongoose";

const schema = new Schema(
  {
    title: {
      type: String,
      minLength: [2, "too short product name"],
      required: true,
      trim: true,
      unique: [true, "name is required"],
    },

    slug: {
      type: String,
      lowerCase: true,
      required: true,
    },
    description: {
      type: String,
      required: true,
      minLength: 5,
      maxLength: 2000,
    },
    imageCover: String,
    images: [String],
    price: {
      type: Number,
      required: true,
      min: 0,
    },
    priceAfterDiscount: {
      type: Number,
      required: true,
      min: 0,
    },
    sold: Number,
    stock: {
      type: Number,
      min: 0,
    },
    category: {
      type: Types.ObjectId,
      ref: "Category",
    },
    SubCategory: {
      type: Types.ObjectId,
      ref: "SubCategory",
    },
    brand: {
      type: Types.ObjectId,
      ref: "Brand",
    },
    rateAvg: {
      type: Number,
      min: 0,
      max: 5,
    },
    rateCount: Number,
    createdBy: {
      type: Types.ObjectId,
      ref: "User",
    },
  },
  {
    versionKey: false,
    timestamps: true,
    toJSON: { virtuals: true },
    id: false,
  }
);

schema.virtual("myReviews", {
  ref: "Review",
  localField: "_id",
  foreignField: "product",
});

schema.pre("find", function () {
  this.populate("myReviews");
});
schema.post("init", function (doc) {
  if (doc.imageCover)
    doc.imageCover = process.env.BASE_URL + "products/" + doc.imageCover;
  if (doc.images)
    doc.images = doc.images.map(
      (img) => process.env.BASE_URL + "products/" + img
    );
});
export const Product = model("Product", schema);
