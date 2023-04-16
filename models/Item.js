const mongoose = require("mongoose");
const slugify = require("slugify");
const geocoder = require("../utils/geocoder");

const ItemSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      trim: true,
      maxlength: [50, "Name can not be more than 50 characters"],
    },
    slug: String,
    info: {
      type: String,
      required: [true, "Please add item info"],
      maxlength: [500, "info can not be more than 500 characters"],
    },
    photo: {
      type: String,
      default: "no-photo.jpg",
    },
    price: {
      value: {
        type: Number,
        required: true,
      },
      per: String,
    },
    itemNumber: {
      type: String,
      required: [true, "Please add a itemNumber"],
      unique: true,
    },

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

// Create bootcamp slug from the name
ItemSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

module.exports = mongoose.model("Item", ItemSchema);
