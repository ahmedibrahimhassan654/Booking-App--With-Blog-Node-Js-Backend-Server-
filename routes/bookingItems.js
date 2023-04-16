const express = require("express");
const {
  BookNewItem,
  getAllBooking,
  checkBookedDatesOfItem,
  deleteBooking,
  myBookings,
} = require("../controllers/bookingItem");

const router = express.Router();

const { protect } = require("../middleware/auth");

router.post("/", protect, BookNewItem);
router.get("/", getAllBooking);
router.get("/:itemId", checkBookedDatesOfItem);
router.delete("/:bookingId", deleteBooking);
router.get("/myBookings", myBookings);

module.exports = router;
