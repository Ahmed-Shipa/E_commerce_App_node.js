import { catchError } from "../../middleware/catchError.js";
import { AppError } from "../../utilities/appError.js";
import { User } from "../../model/user.model.js";
import { Cart } from "../../model/cart.model.js";
import { Product } from "../../model/product.model.js";
import { Coupon } from "../../model/coupon.model.js";

// calculate total cart price
function calcTotalPrice(isCartExist) {
  isCartExist.totalCartPrice = isCartExist.cartItems.reduce(
    (prev, item) => (prev += item.quantity * item.price),
    0
  );

  if (isCartExist.discount) {
    isCartExist.totalCartPriceAfterDiscount =
      isCartExist.totalCartPrice -
      (isCartExist.totalCartPrice * isCartExist.discount) / 100;
  }
}

// add to cart
const addToCart = catchError(async (req, res, next) => {
  // check if user has cart
  let isCartExist = await Cart.findOne({ user: req.user._id });
  // check the stock of product
  let product = await Product.findById(req.body.product);
  if (!product) return next(new AppError(`product not found`, 404));
  req.body.price = product.price;
  if (req.body.quantity > product.stock)
    return next(new AppError(`sold out`, 404));

  if (!isCartExist) {
    // create cart for user
    let cart = new Cart({
      user: req.user._id,
      cartItems: [req.body],
    });
    calcTotalPrice(cart);
    await cart.save();
    res.json({ message: " success", cart });
  } else {
    // find ====> array method not mongDb
    let item = isCartExist.cartItems.find(
      (item) => item.product == req.body.product
    );

    if (item) {
      item.quantity += req.body.quantity || 1;
      await isCartExist.save();
      if (item.quantity > product.stock)
        return next(new AppError(`sold out`, 404));
    }
    if (!item) isCartExist.cartItems.push(req.body);
    calcTotalPrice(isCartExist);
    await isCartExist.save();
    res.json({ message: " success", isCartExist });
  }
});

// update quantity
const updateQuantity = catchError(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  let item = cart.cartItems.find((item) => item.product == req.params.id);
  if (!item) return next(new AppError("Product Not Fount", 401));

  item.quantity = req.body.quantity;
  calcTotalPrice(cart);
  await cart.save();

  res.status(201).json({ message: "Success", cart });
});

// remove product from cart
let removeProduct = catchError(async (req, res, next) => {
  const cart = await Cart.findOneAndUpdate(
    { user: req.user._id },
    { $pull: { cartItems: { _id: req.params.id } } },
    { new: true }
  );
  calcTotalPrice(cart);
  await cart.save();
  cart || next(new AppError("product not found", 401));
  !cart || res.status(201).json({ message: "Success Deleted", cart });
});

// get user cart
let getLoggedUserCart = catchError(async (req, res, next) => {
  const cart = await Cart.findOne({ user: req.user._id });
  cart || next(new AppError("product not found", 401));
  !cart || res.status(201).json({ message: "Success", cart });
});

//clear the cart
let clearCart = catchError(async (req, res, next) => {
  const cart = await Cart.findOneAndDelete({ user: req.user._id });
  cart || next(new AppError("product not found", 401));
  !cart || res.status(201).json({ message: "Cart cleared" });
});

// apply coupon
const applyCoupon = catchError(async (req, res, next) => {
  const coupon = await Coupon.findOne({
    code: req.body.code,
    expires: { $gte: Date.now() },
  });
  if (!coupon) return next(new AppError("invalid coupon", 401));
  const cart = await Cart.findOne({ user: req.user._id });

  cart.discount = coupon.discount;

  await cart.save();
  res.status(201).json({ message: "Success", cart });
});

export {
  addToCart,
  updateQuantity,
  removeProduct,
  getLoggedUserCart,
  clearCart,
  applyCoupon,
};
