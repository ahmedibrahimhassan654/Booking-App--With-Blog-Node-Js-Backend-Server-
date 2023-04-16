const mongoose = require("mongoose");
const timeZone = require("mongoose-timezone");

const bookingItemSchema = new mongoose.Schema(
  {
    item: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "Item",
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
      ref: "User",
    },
    checkInDate: {
      type: Date,
      required: true,
    },
    checkOutDate: {
      type: Date,
      required: true,
    },
    amountPaid: {
      type: Number,
      required: true,
    },
    daysOfStay: {
      type: Number,
      required: true,
    },
    contactInfo: {
      email: {
        type: String,

        match: [
          /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
          "Please add a valid email",
        ],
      },
      phone: {
        type: String,
      },
    },
    shipingAddress: {
      type: String,
    },
    // paymentInfo: {
    //   id: {
    //     type: String,
    //     required: true,
    //   },
    //   status: {
    //     type: String,
    //     required: true,
    //   },
    // },
    // paidAt: {
    //   type: Date,
    //   required: true,
    // },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

bookingItemSchema.plugin(timeZone);

module.exports = mongoose.model("BookingItem", bookingItemSchema);
