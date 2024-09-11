import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utilities/appError.js";
import { User } from "../../model/user.model.js";
import { deleteOne } from "../handlers/handlers.js";
import { ApiFeatures } from "../../utilities/apiFeature.js";

// add user
const addUser = catchError(async (req, res, next) => {
  const user = new User(req.body);
  await user.save();
  res.status(201).json({ message: "user added successfully", user });
});

// get user
const getUser = catchError(async (req, res, next) => {
  const user = await User.findById(req.params.id);
  user || next(new AppError("user not found", 404));
  !user || res.json({ user });
});

// get all users
const getAllUsers = catchError(async (req, res, next) => {
  let apiFeatures = new ApiFeatures(User.find(), req.query)
    .pagination()
    .fields()
    .filter()
    .sort()
    .search();
  let users = await apiFeatures.mongooseQuery;
  res
    .status(200)
    .json({ message: "success", page: apiFeatures.pageNumber, users });
});

// update user
const updateUser = catchError(async (req, res, next) => {
  const user = await User.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  // check if user equals null
  user || next(new AppError("user not found", 404));
  !user || res.json({ message: "user updated successfully", user });
});

// delete user
const deleteUser = deleteOne(User);

export { addUser, getAllUsers, getUser, updateUser, deleteUser };
