import { Router } from "express";
import {
  addCategory,
  deleteCategory,
  getAllCategories,
  getCategory,
  updateCategory,
} from "./category.controller.js";
import { uploadSingleFile } from "../../fileUpload/fileUpload.js";
import { addCategoryValidation } from "./category.validation.js";
import { validate } from "../../middleware/validate.js";
import subCategoryRouter from "../subCategory/subCategory.routes.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";

// merge params
const categoryRouter = Router();
categoryRouter.use("/:category/subcategories", subCategoryRouter);

categoryRouter
  .route("/")
  .post(
    protectedRoutes,
    allowedTo("user", "admin"),
    uploadSingleFile("image", "categories"),
    validate(addCategoryValidation),
    addCategory
  )
  .get(getAllCategories);
categoryRouter
  .route("/:id")
  .get(getCategory)
  .put(
    protectedRoutes,
    allowedTo("admin"),
    uploadSingleFile("image", "categories"),
    updateCategory
  )
  .delete(protectedRoutes, allowedTo("admin"), deleteCategory);

export default categoryRouter;
