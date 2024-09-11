import { model, Schema, Types } from "mongoose";

const schema = new Schema(
  {
    name: {
      type: String,
      minLength: [2, "too short category name"],
      required: true,
      trim: true,
      unique: [true, "name is required"],
    },
    slug: {
      type: String,
      lowerCase: true,
      required: true,
      unique: [true, "name is required"],
    },
    image: String,
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

schema.post("init", function (doc) {
  if (doc.image) doc.image = process.env.BASE_URL + "categories/" + doc.image;
});

export const Category = model("Category", schema);
