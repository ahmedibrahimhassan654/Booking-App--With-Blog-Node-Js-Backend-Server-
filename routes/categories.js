const express = require("express");

const {
  createCategory,
  list,
  getSingleCategory,
  updateCategory,
  deleteCategory,
} = require("../controllers/categories");

const router = express.Router();

const { protect, authorize } = require("../middleware/auth");

router.post(
  "/create",
  protect,
  authorize("publisher", "admin"),
  createCategory
);
router.get("/list", list);
router.get("/:slug", getSingleCategory);
router.put("/:slug", updateCategory);
router.delete(
  "/:slug",
  protect,
  authorize("publisher", "admin"),
  deleteCategory
);

// router.get('/logout', logout);
// router.get('/me', protect, getMe);
// router.put('/updatedetails', protect, updateDetails);
// router.put('/updatepassword', protect, updatePassword);
// router.post('/forgotpassword', forgotPassword);
// router.put('/resetpassword/:resettoken', resetPassword);

module.exports = router;
