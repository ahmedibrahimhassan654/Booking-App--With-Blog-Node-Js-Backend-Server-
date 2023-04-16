const mongoose = require("mongoose");

const BlogCategorySchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    title: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const BlogCat = mongoose.model("BlogCat", BlogCategorySchema);

module.exports = BlogCat;
