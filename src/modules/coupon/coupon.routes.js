import { Router } from "express";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";
import {
  addCoupon,
  deleteCoupon,
  getAllCoupons,
  getCoupon,
  updateCoupon,
} from "./coupon.controller.js";

const couponRouter = Router();

couponRouter.use(protectedRoutes, allowedTo("admin"));
couponRouter.route("/").post(addCoupon).get(getAllCoupons);
couponRouter
  .route("/:id")
  .get(getCoupon)
  .put(updateCoupon)
  .delete(deleteCoupon);

export default couponRouter;
