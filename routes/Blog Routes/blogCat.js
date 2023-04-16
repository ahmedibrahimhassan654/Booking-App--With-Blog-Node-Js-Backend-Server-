const express = require("express");
const {
  categoryDetailsCtrl,
  createCategoryCtrl,
  deleteCategoryCtrl,
  updateCategoryCtrl,
  fetchCategoriesCtrl,
} = require("../../controllers/BlogController/blogCat");
const { protect, authorize } = require("../../middleware/auth");

const blogCategoryRouter = express.Router();

//POST/api/v1/categories
blogCategoryRouter.post(
  "/",
  protect,
  authorize("publisher", "admin"),
  createCategoryCtrl
);

//GET/api/v1/categories
blogCategoryRouter.get("/", fetchCategoriesCtrl);
//GET/api/v1/categories/:id
blogCategoryRouter.get("/:id", categoryDetailsCtrl);

//DELETE/api/v1/categories/:id
blogCategoryRouter.delete(
  "/:id",
  protect,
  authorize("publisher", "admin"),
  deleteCategoryCtrl
);

//PUT/api/v1/categories/:id
blogCategoryRouter.put(
  "/:id",
  protect,
  authorize("publisher", "admin"),
  updateCategoryCtrl
);

module.exports = blogCategoryRouter;
