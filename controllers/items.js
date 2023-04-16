const ErrorResponse = require("../utils/errorresponse");
const asyncHandler = require("../middleware/async");
const Item = require("../models/Item");
const Product = require("../models/Products");

exports.createItemForProduct = asyncHandler(async (req, res, next) => {
  const productlId = req.params.productid;
  const newItem = new Item(req.body);

  try {
    const savedItem = await newItem.save();
    try {
      await Product.findByIdAndUpdate(productlId, {
        $push: { items: savedItem._id },
      });
    } catch (err) {
      next(err);
    }
    res.status(200).json(savedItem);
  } catch (err) {
    next(err);
  }
});

exports.updateItem = asyncHandler(async (req, res, next) => {
  try {
    const updatedItem = await Item.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true }
    );
    res.status(200).json(updatedItem);
  } catch (err) {
    next(err);
  }
});

exports.getItem = asyncHandler(async (req, res, next) => {
  try {
    const item = await Item.findById(req.params.id);
    res.status(200).json(item);
  } catch (err) {
    next(err);
  }
});

exports.getAllItems = asyncHandler(async (req, res, next) => {
  try {
    const items = await Item.find();
    res.status(200).json({ number: items.length, data: items });
  } catch (err) {
    next(err);
  }
});

exports.deleteItem = asyncHandler(async (req, res, next) => {
  const productlId = req.params.productid;
  try {
    await Item.findByIdAndDelete(req.params.id);
    try {
      await Product.findByIdAndUpdate(productlId, {
        $pull: { items: req.params.id },
      });
    } catch (err) {
      next(err);
    }
    res.status(200).json("item has been deleted.");
  } catch (err) {
    next(err);
  }
});
