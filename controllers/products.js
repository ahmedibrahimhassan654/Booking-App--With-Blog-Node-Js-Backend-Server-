const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Product = require("../models/Products");
const Category = require("../models/Category");
const mongoose = require("mongoose");
const { ObjectId } = mongoose.Schema;
// @desc     Create category
// @route     POST /api/v1/category
// @access    Public
exports.createProduct = asyncHandler(async (req, res, next) => {
  const { name, description, category } = req.body;
  //   console.log(req.body.category);
  // //   let category = req.body.category;
  const validcategory = await Category.findById({ _id: category });
  console.log(validcategory);
  if (!validcategory) {
    return next(
      new ErrorResponse(`No category with name of ${validcategory}`),
      404
    );
  }

  // Create category
  const newProduct = await new Product({
    name,
    description,
    category,
  }).save();

  // console.log("new product created ", newProduct);
  res.status(200).json({ success: true, data: newProduct });
});

exports.list = asyncHandler(async (req, res, next) => {
  const products = await Product.find()

    .populate("category")
    // .populate('items')
    .sort([["createdAt", "desc"]]);

  console.log("all products", products);

  res.status(200).json({ success: true, num: products.length, data: products });
});

exports.getProduct = asyncHandler(async (req, res, next) => {
  const product = await Product.findById({ _id: req.params.id })
    .populate("category")
    .populate("items");
  if (!product) {
    return next(
      new ErrorResponse(`No product with id of ${req.params.id}`),
      404
    );
  }
  res.status(200).json({ success: true, data: product });
});

exports.updateProduct = asyncHandler(async (req, res, next) => {
  let product = await Product.findOne({ _id: req.params.id });

  if (!product) {
    return next(
      new ErrorResponse(`product not found with id of ${req.params.id}`, 404)
    );
  }

  product = await Product.findOneAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: product });
});

exports.deleteProduct = asyncHandler(async (req, res, next) => {
  let product = await Product.findOne({ _id: req.params.id });

  if (!product) {
    return next(
      new ErrorResponse(`product not found with name of ${req.params.id}`, 404)
    );
  }

  product = await Product.findOneAndDelete({ _id: req.params.id });

  res.status(200).json({ success: true, message: "product deleted", data: {} });
});
