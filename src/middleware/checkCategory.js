import { Brand } from "../model/brand.model.js";
import { Category } from "../model/category.model.js";
import { SubCategory } from "../model/subCategory.model.js";
import { AppError } from "../utilities/appError.js";
import { catchError } from "./catchError.js";

export const checkCategory = catchError(async (req, res, next) => {
  const category = await Category.findById({ _id: req.body.category });
  const Sub = await SubCategory.findById({ _id: req.body.SubCategory });
  const brand = await Brand.findById({ _id: req.body.brand });
  if (!category || !Sub || !brand)
    return next(new AppError("data not found", 404));
  next();
});
