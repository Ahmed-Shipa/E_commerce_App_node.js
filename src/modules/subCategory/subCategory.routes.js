import { Router } from "express";
import {
  addSubCategory,
  deleteSubCategory,
  getAllSubCategories,
  getSubCategory,
  updateSubCategory,
} from "./subCategory.controller.js";
import { checkCategory } from "../../middleware/checkCategory.js";
import { allowedTo, protectedRoutes } from "../auth/auth.controller.js";

const subCategoryRouter = Router();

subCategoryRouter
  .route("/")
  .post(
    protectedRoutes,
    allowedTo("user", "admin"),
    // checkCategory,
    addSubCategory
  )
  .get(getAllSubCategories);
subCategoryRouter
  .route("/:id")
  .get(getSubCategory)
  .put(protectedRoutes, allowedTo("admin"), updateSubCategory)
  .delete(protectedRoutes, allowedTo("admin"), deleteSubCategory);

export default subCategoryRouter;
