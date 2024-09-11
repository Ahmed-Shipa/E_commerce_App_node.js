import slugify from "slugify";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utilities/appError.js";
import { Brand } from "../../model/brand.model.js";
import { deleteOne } from "../handlers/handlers.js";
import { ApiFeatures } from "../../utilities/apiFeature.js";

// add brand
const addBrand = catchError(async (req, res, next) => {
  req.body.slug = slugify(req.body.name);
  req.body.logo = req.file.filename;
  const brand = new Brand(req.body);
  await brand.save();
  res.status(201).json({ message: "Brand added successfully", brand });
});

// get brand
const getBrand = catchError(async (req, res, next) => {
  const brand = await Brand.findById(req.params.id);
  brand || next(new AppError("brand not found", 404));
  !brand || res.json({ brand });
});

// get all brands
const getAllBrands = catchError(async (req, res, next) => {
  let apiFeatures = new ApiFeatures(Brand.find(), req.query)
    .pagination()
    .fields()
    .filter()
    .sort()
    .search();
  let brands = await apiFeatures.mongooseQuery
    .populate("category", "name")
    .populate("subcategory", "name");
  res
    .status(200)
    .json({ message: "success", page: apiFeatures.pageNumber, brands });
});

// update brand
const updateBrand = catchError(async (req, res, next) => {
  if (req.body.slug) req.body.slug = slugify(req.body.name);
  if (req.file) req.body.logo = req.file.filename;
  const brand = await Brand.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  // check if brand equals null
  brand || next(new AppError("brand not found", 404));
  !brand || res.json({ message: "Brand updated successfully", brand });
});

// delete brand
const deleteBrand = deleteOne(Brand);

export { addBrand, getAllBrands, getBrand, updateBrand, deleteBrand };
