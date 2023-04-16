const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
const { transliterate, slugify } = require("transliteration");

const ProductSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      trim: true,
      required: [true, "please add an product name"],
      minlength: [3, "too short"],
      maxlength: [100, "Too Long"],
    },
    description: {
      type: String,
      trim: true,
      required: [true, "please add  product description"],
      minlength: [3, "too short"],
      maxlength: [100, "Too Long"],
    },
    slug: {
      type: String,
      lowercase: true,
      index: true,
    },
    category: {
      type: ObjectId,
      ref: "Category",
      required: true,
    },
    images: { type: [String] },

    items: [{ type: ObjectId, ref: "Item", required: true }],
  },
  { timestamps: true }
);

ProductSchema.pre("save", function (next) {
  this.slug = slugify(this.name, { lower: true });
  this.tr = transliterate(this.name);
  next();
});

module.exports = mongoose.model("Product", ProductSchema);
