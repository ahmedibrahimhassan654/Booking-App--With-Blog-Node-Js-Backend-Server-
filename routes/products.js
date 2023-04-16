const express = require("express");

const {
  createCategory,
  list,
  getProduct,
  updateProduct,
  deleteProduct,
  createProduct,
} = require("../controllers/products");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

router.post("/create", protect, authorize("publisher", "admin"), createProduct);
router.get("/list", list);
router
  .route("/:id")
  .get(getProduct)
  .put(protect, authorize("publisher", "admin"), updateProduct)
  .delete(protect, authorize("publisher", "admin"), deleteProduct);

module.exports = router;
