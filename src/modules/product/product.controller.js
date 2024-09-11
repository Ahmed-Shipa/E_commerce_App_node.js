import slugify from "slugify";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utilities/appError.js";
import { Product } from "../../model/product.model.js";
import { deleteOne } from "../handlers/handlers.js";
import { ApiFeatures } from "../../utilities/apiFeature.js";

// add product
const addProduct = catchError(async (req, res, next) => {
  // code starts in middleware checkCategory.js
  req.body.slug = slugify(req.body.title);
  req.body.imageCover = req.files.imageCover[0].filename;
  req.body.images = req.files.images.map((img) => img.filename);

  const product = new Product(req.body);
  await product.save();
  res.status(201).json({ message: "Product added successfully", product });
});

// get product
const getProduct = catchError(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  product || next(new AppError("Product not found", 404));
  !product || res.json({ product });
});

// get all products
const getAllProducts = catchError(async (req, res, next) => {
  let apiFeatures = new ApiFeatures(Product.find(), req.query)
    .pagination()
    .fields()
    .filter()
    .sort()
    .search();
  let products = await apiFeatures.mongooseQuery
    .populate("category", "name")
    .populate("SubCategory", "name");
  res
    .status(200)
    .json({ message: "success", page: apiFeatures.pageNumber, products });
});

// update product
const updateProduct = catchError(async (req, res, next) => {
  req.body.slug = slugify(req.body.title);
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  // check if product equals null
  product || next(new AppError("product not found", 404));
  !product || res.json({ message: "Product updated successfully", product });
});

// delete product
const deleteProduct = deleteOne(Product);

export { addProduct, getAllProducts, getProduct, updateProduct, deleteProduct };



