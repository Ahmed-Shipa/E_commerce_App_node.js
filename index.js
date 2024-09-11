import express from "express";
import categoryRouter from "./src/modules/category/category.routes.js";
import { dbConnection } from "./dbConnection/dbConnection.js";
import { globalError } from "./src/middleware/globalError.js";
import { AppError } from "./src/utilities/appError.js";
import subCategoryRouter from "./src/modules/subCategory/subCategory.routes.js";
import BrandRouter from "./src/modules/brand/brand.routes.js";
import productRouter from "./src/modules/product/product.routes.js";
import userRouter from "./src/modules/user/user.routes.js";
import authRouter from "./src/modules/auth/auth.routes.js";
import dotenv from "dotenv";
import reviewRouter from "./src/modules/review/review.routes.js";
import wishlistRouter from "./src/modules/wishlist/wishlist.routes.js";
import addressRouter from "./src/modules/address/address.routes.js";
import couponRouter from "./src/modules/coupon/coupon.routes.js";
import cartRouter from "./src/modules/cart/cart.routes.js";
import cors from "cors"
dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(cors())
app.use(express.json());
app.use("/uploads", express.static("uploads"));

app.use("/api/categories", categoryRouter);
app.use("/api/subcategories", subCategoryRouter);
app.use("/api/brands", BrandRouter);
app.use("/api/products", productRouter);
app.use("/api/users", userRouter);
app.use("/api/auth", authRouter);
app.use("/api/reviews", reviewRouter);
app.use("/api/wishlist", wishlistRouter);
app.use("/api/addresses", addressRouter);
app.use("/api/coupons", couponRouter);
app.use("/api/carts", cartRouter);

// handle unhandled routes
app.use("*", (req, res, next) => {
  next(new AppError(`route not found ${req.originalUrl}`, 404));
});

// main handler of error
app.use(globalError);

//handle error outside express
process.on("unhandledRejection", (err) => {
  console.log(err);
});

app.get("/", (req, res) => res.send("Hello World!"));
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
