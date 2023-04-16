const express = require("express");

const {
  createItemForProduct,
  updateItem,
  getItem,
  getAllItems,
  deleteItem,
} = require("../controllers/items");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

router.post(
  "/:productid",
  protect,
  authorize("publisher", "admin"),
  createItemForProduct
);
router.get("/", getAllItems);
router
  .route("/:id")
  .get(getItem)
  .put(protect, authorize("publisher", "admin"), updateItem);

//DELETE
router.delete(
  "/:id/:productid",
  protect,
  authorize("publisher", "admin"),
  deleteItem
);

//   .delete(protect, authorize("publisher", "admin"), deleteProduct);

module.exports = router;
