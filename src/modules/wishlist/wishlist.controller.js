import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utilities/appError.js";
import { User } from "../../model/user.model.js";

// add to wishlist
const AddToWishlist = catchError(async (req, res, next) => {
  const wishlist = await User.findByIdAndUpdate(
    req.user._id,
    { $addToSet: { wishlist: req.body.product } },
    {
      new: true,
    }
  );
  // check if wishlist equals null
  wishlist || next(new AppError("wishlist not found", 404));
  !wishlist ||
    res.json({
      message: "wishlist updated successfully",
      wishlist: wishlist.wishlist,
    });
});

// remove from wishlist
const removeFromWishlist = catchError(async (req, res, next) => {
  const wishlist = await User.findByIdAndUpdate(
    req.user._id,
    { $pull: { wishlist: req.params.id } },
    {
      new: true,
    }
  );
  // check if wishlist equals null
  wishlist || next(new AppError("wishlist not found", 404));
  !wishlist ||
    res.json({
      message: "product deleted from wishlist successfully",
      wishlist: wishlist.wishlist,
    });
});

// get wishlist
const getLoggedUserWishlist = catchError(async (req, res, next) => {
  const wishlist = await User.findById(req.user._id).populate("wishlist");

  // check if wishlist equals null
  wishlist || next(new AppError("wishlist not found", 404));
  !wishlist ||
    res.json({
      message: "success",
      wishlist: wishlist.wishlist,
    });
});

export { AddToWishlist, removeFromWishlist, getLoggedUserWishlist };
