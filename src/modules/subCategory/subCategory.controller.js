import slugify from "slugify";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utilities/appError.js";
import { SubCategory } from "../../model/subCategory.model.js";
import { Category } from "../../model/category.model.js";
import { deleteOne } from "../handlers/handlers.js";
import { ApiFeatures } from "../../utilities/apiFeature.js";

// add subcategory
const addSubCategory = catchError(async (req, res, next) => {
  // code starts in middleware checkCategory.js
  req.body.slug = slugify(req.body.name);
  const subcategory = new SubCategory(req.body);

  await subcategory.save();
  res
    .status(201)
    .json({ message: "subCategory added successfully", subcategory });
});

// get subcategory
const getSubCategory = catchError(async (req, res, next) => {
  const Subcategory = await SubCategory.findById(req.params.id);
  Subcategory || next(new AppError("Subcategory not found", 404));
  !Subcategory || res.json({ Subcategory });
});

// get all subcategories
const getAllSubCategories = catchError(async (req, res, next) => {
  let filter = {};
  if (req.params.category) filter.category = req.params.category;

  let apiFeatures = new ApiFeatures(SubCategory.find(), req.query)
    .pagination()
    .fields()
    .filter()
    .sort()
    .search();

  let subcategories = await apiFeatures.mongooseQuery.populate("category","name -_id");
  res
    .status(200)
    .json({ message: "success", page: apiFeatures.pageNumber, subcategories });
});

// update subcategory
const updateSubCategory = catchError(async (req, res, next) => {
  req.body.slug = slugify(req.body.name);
  const Subcategory = await SubCategory.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
    }
  );
  // check if subcategory equals null
  Subcategory || next(new AppError("subcategory not found", 404));
  !Subcategory ||
    res.json({ message: "SubCategory updated successfully", Subcategory });
});

// delete subcategory
const deleteSubCategory = deleteOne(SubCategory);

export {
  addSubCategory,
  getAllSubCategories,
  getSubCategory,
  updateSubCategory,
  deleteSubCategory,
};
