const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const Category = require("../models/Category");
// @desc     Create category
// @route     POST /api/v1/category
// @access    Public
exports.createCategory = asyncHandler(async (req, res, next) => {
  const { name, description } = req.body;

  // Create category
  const category = await Category.create({
    name,
    description,
  });

  res.status(200).json({ success: true, data: category });
});

exports.list = asyncHandler(async (req, res, next) => {
  const allCategory = await Category.find({}).sort({ createdAt: -1 }).exec();

  res
    .status(200)
    .json({ success: true, number: allCategory.length, data: allCategory });
});

exports.getSingleCategory = asyncHandler(async (req, res, next) => {
  const category = await Category.findOne({ slug: req.params.slug }).exec();
  if (!category) {
    return next(
      new ErrorResponse(
        `category not found with name of ${req.params.slug}`,
        404
      )
    );
  }
  res.status(200).json({ success: true, data: category });
});
exports.updateCategory = asyncHandler(async (req, res, next) => {
  let category = await Category.findOne({ slug: req.params.slug });

  if (!category) {
    return next(
      new ErrorResponse(
        `category not found with name of ${req.params.slug}`,
        404
      )
    );
  }

  // // Make sure user is bootcamp owner
  // if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
  //   return next(
  //     new ErrorResponse(
  //       `User ${req.params.id} is not authorized to update this bootcamp`,
  //       401
  //     )
  //   );
  // }

  category = await Category.findOneAndUpdate(req.params.slug, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({ success: true, data: category });
});

exports.deleteCategory = asyncHandler(async (req, res, next) => {
  let category = await Category.findOne({ slug: req.params.slug });

  if (!category) {
    return next(
      new ErrorResponse(
        `category not found with name of ${req.params.slug}`,
        404
      )
    );
  }

  // // Make sure user is bootcamp owner
  // if (bootcamp.user.toString() !== req.user.id && req.user.role !== 'admin') {
  //   return next(
  //     new ErrorResponse(
  //       `User ${req.params.id} is not authorized to update this bootcamp`,
  //       401
  //     )
  //   );
  // }

  category = await Category.findOneAndDelete({ slug: req.params.slug });

  res.status(200).json({ success: true, data: {} });
});
