import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utilities/appError.js";
import { User } from "../../model/user.model.js";

// add to address
const addAddress = catchError(async (req, res, next) => {
  const address = await User.findByIdAndUpdate(
    req.user._id,
    { $push: { addresses: req.body } },
    {
      new: true,
    }
  );
  // check if address equals null
  address || next(new AppError("address not found", 404));
  !address ||
    res.json({
      message: "address updated successfully",
      address: address.addresses,
    });
});

// remove from address
const removeAddress = catchError(async (req, res, next) => {
  const address = await User.findByIdAndUpdate(
    req.user._id,
    { $pull: { address: { _id: req.params.id } } },
    {
      new: true,
    }
  );
  // check if address equals null
  address || next(new AppError("address not found", 404));
  !address ||
    res.json({
      message: "product deleted from address successfully",
      address: address.addresses,
    });
});

// get address
const getLoggedUserAddress = catchError(async (req, res, next) => {
  const address = await User.findById(req.user._id);

  // check if address equals null
  address || next(new AppError("address not found", 404));
  !address ||
    res.json({
      message: "success",
      address: address.addresses,
    });
});

export { addAddress, removeAddress, getLoggedUserAddress };
