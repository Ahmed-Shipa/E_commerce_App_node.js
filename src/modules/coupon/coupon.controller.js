import slugify from "slugify";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utilities/appError.js";
import { Coupon } from "../../model/coupon.model.js";
import { deleteOne } from "../handlers/handlers.js";
import { ApiFeatures } from "../../utilities/apiFeature.js";

// add coupon
const addCoupon = catchError(async (req, res, next) => {
  const coupon = new Coupon(req.body);
  await coupon.save();
  res.status(201).json({ message: "coupon added successfully", coupon });
});

// get coupon
const getCoupon = catchError(async (req, res, next) => {
  // set coupon to be unique
  let isExists = await Coupon.findOne({ code: req.body.code });
  if (isExists) return next(new AppError(`coupon exists`, 409));
  const coupon = await Coupon.findById(req.params.id);
  coupon || next(new AppError("coupon not found", 404));
  !coupon || res.json({ coupon });
});

// get all coupons
const getAllCoupons = catchError(async (req, res, next) => {
  let apiFeatures = new ApiFeatures(Coupon.find(), req.query)
    .pagination()
    .fields()
    .filter()
    .sort()
    .search();
  let coupons = await apiFeatures.mongooseQuery;
  res
    .status(200)
    .json({ message: "success", page: apiFeatures.pageNumber, coupons });
});

// update coupon
const updateCoupon = catchError(async (req, res, next) => {
  const coupon = await Coupon.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  // check if coupon equals null
  coupon || next(new AppError("coupon not found", 404));
  !coupon || res.json({ message: "coupon updated successfully", coupon });
});

// delete coupon
const deleteCoupon = deleteOne(Coupon);

export { addCoupon, getAllCoupons, getCoupon, updateCoupon, deleteCoupon };
