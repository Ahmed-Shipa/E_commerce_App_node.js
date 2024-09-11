import { Router } from "express";

import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import {
  addToCart,
  applyCoupon,
  clearCart,
  getLoggedUserCart,
  removeProduct,
  updateQuantity,
} from "./cart.controller.js";

const cartRouter = Router();

cartRouter
  .route("/")
  .post(protectedRoutes, allowedTo("user"), addToCart)
  .get(protectedRoutes, allowedTo("user"), getLoggedUserCart)
  .delete(protectedRoutes, allowedTo("user"), clearCart);

cartRouter
  .route("/:id")
  .put(protectedRoutes, allowedTo("user"), updateQuantity)
  .delete(protectedRoutes, allowedTo("user"), removeProduct);

cartRouter.post(
  "/apply-coupon",
  protectedRoutes,
  allowedTo("user"),
  applyCoupon
);

export default cartRouter;
