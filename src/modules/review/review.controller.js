import slugify from "slugify";
import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utilities/appError.js";

import { deleteOne } from "../handlers/handlers.js";
import { ApiFeatures } from "../../utilities/apiFeature.js";
import { Review } from "../../model/review.model.js";

// add review
const addReview = catchError(async (req, res, next) => {
  req.body.user = req.user._id;
  let isExist = await Review.findOne({
    user: req.user._id,
    product: req.body.product,
  });
  if (isExist) return next(new AppError("you created a review before", 409));
  const review = new Review(req.body);
  await review.save();
  res.status(201).json({ message: "review added successfully", review });
});

// get review
const getReview = catchError(async (req, res, next) => {
  const review = await Review.findById(req.params.id);
  review || next(new AppError("review not found", 404));
  !review || res.json({ review });
});

// get all reviews
const getAllReviews = catchError(async (req, res, next) => {
  let apiFeatures = new ApiFeatures(Review.find(), req.query)
    .pagination()
    .fields()
    .filter()
    .sort()
    .search();
  let reviews = await apiFeatures.mongooseQuery;
  res
    .status(200)
    .json({ message: "success", page: apiFeatures.pageNumber, reviews });
});

// update review
const updateReview = catchError(async (req, res, next) => {
  const review = await Review.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  // check if review equals null
  review || next(new AppError("review not found", 404));
  !review || res.json({ message: "review updated successfully", review });
});

// delete review
const deleteReview = deleteOne(Review);

export { addReview, getAllReviews, getReview, updateReview, deleteReview };
