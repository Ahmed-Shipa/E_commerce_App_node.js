import slugify from "slugify";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utilities/appError.js";
import { Category } from "../../model/category.model.js";
import { deleteOne } from "../handlers/handlers.js";
import { ApiFeatures } from "../../utilities/apiFeature.js";

// add category
const addCategory = catchError(async (req, res, next) => {
  // code starts in middleware checkCategory.js
  req.body.slug = slugify(req.body.name);
  req.body.image = req.file.filename;
  const category = new Category(req.body);

  await category.save();
  res.status(201).json({ message: "Category added successfully", category });
});

// get category
const getCategory = catchError(async (req, res, next) => {
  const category = await Category.findById(req.params.id);
  category || next(new AppError("category not found", 404));
  !category || res.json({ category });
});

// get all categories
const getAllCategories = catchError(async (req, res, next) => {
  let apiFeatures = new ApiFeatures(Category.find(), req.query)
    .pagination()
    .fields()
    .filter() 
    .sort()
    .search();
  let categories = await apiFeatures.mongooseQuery;
  res
    .status(200)
    .json({ message: "success", page: apiFeatures.pageNumber, categories });
});

// update category
const updateCategory = catchError(async (req, res, next) => {
  if (req.body.slug) req.body.slug = slugify(req.body.name);
  if (req.file) req.body.image = req.file.filename;

  const category = await Category.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  // check if category equals null
  category || next(new AppError("category not found", 404));
  !category || res.json({ message: "Category updated successfully", category });
});

// delete category
const deleteCategory = deleteOne(Category);

export {
  addCategory,
  getAllCategories,
  getCategory,
  updateCategory,
  deleteCategory,
};
