const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const BookingItem = require("../models/BoookingItem");
const Moment = require("moment");
const MomentRange = require("moment-range");

exports.BookNewItem = asyncHandler(async (req, res, next) => {
  const {
    item,
    checkInDate,
    checkOutDate,
    daysOfStay,
    amountPaid,
    contactInfo,
    shipingAddress,
  } = req.body;
  // req.body.user = req.user.id;
  // check if the item is available obetween
  const availability = await checkRoomAvailability(
    item,
    checkInDate,
    checkOutDate
  );
  if (availability) {
    const booking = await BookingItem.create({
      item,
      user: req.user.id,
      checkInDate,
      checkOutDate,
      daysOfStay,
      amountPaid,
      contactInfo,
      shipingAddress,
      createdAt: Date.now(),
    });

    res.status(200).json({
      message: "item booked  ",
      booking,
    });
  } else {
    return next(new ErrorResponse("Item Already Booked on this  time ", 400));
  }
});

exports.getAllBooking = asyncHandler(async (req, res, next) => {
  const bookings = await BookingItem.find()
    .populate({
      path: "item",
      select: "name info photo price",
    })
    .populate({
      path: "user",
      select: "name email",
    });

  res.status(200).json({
    success: true,
    num: bookings.length,
    bookings,
  });
});
exports.checkBookedDatesOfItem = asyncHandler(async (req, res, next) => {
  const itemId = req.params.itemId;

  const bookings = await BookingItem.find({ item: itemId });

  let bookedDates = [];
  const moment = MomentRange.extendMoment(Moment);
  const timeDiffernece = moment().utcOffset() / 60;

  bookings.forEach((booking) => {
    const checkInDate = moment(booking.checkInDate).add(
      timeDiffernece,
      "hours"
    );
    const checkOutDate = moment(booking.checkOutDate).add(
      timeDiffernece,
      "hours"
    );

    const range = moment.range(moment(checkInDate), moment(checkOutDate));

    const dates = Array.from(range.by("day"));
    bookedDates = bookedDates.concat(dates);
  });

  res.status(200).json({
    success: true,
    numberOfDays: bookedDates.length,
    bookedDates,
  });
});

exports.deleteBooking = asyncHandler(async (req, res, next) => {
  const booking = await BookingItem.findById(req.params.bookingId);

  if (!booking) {
    return next(new ErrorResponse("Booking not found with this ID", 400));
  }

  await booking.remove();

  res.status(200).json({
    success: true,
  });
});

exports.myBookings = asyncHandler(async (req, res, next) => {
  const bookings = await BookingItem.find({ user: req.user._id })
    .populate({
      path: "item",
      select: "name info photo price",
    })
    .populate({
      path: "user",
      select: "name email",
    });

  res.status(200).json({
    success: true,
    bookings,
  });
});
const checkRoomAvailability = async (itemId, checkInDate, checkOutDate) => {
  checkInDate = new Date(checkInDate);
  checkOutDate = new Date(checkOutDate);

  const bookings = await BookingItem.find({
    item: itemId,
    $and: [
      {
        checkInDate: {
          $lte: checkOutDate,
        },
      },
      {
        checkOutDate: {
          $gte: checkInDate,
        },
      },
    ],
  });

  // Check if there is any booking available
  let isAvailable;

  if (bookings && bookings.length === 0) {
    isAvailable = true;
  } else {
    isAvailable = false;
  }
  // console.log(isAvailable);

  // res.status(200).json({
  //   success: true,
  //   isAvailable,
  // });
  return isAvailable;
};
