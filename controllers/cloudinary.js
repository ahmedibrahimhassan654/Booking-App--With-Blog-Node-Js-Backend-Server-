const ErrorResponse = require("../utils/errorresponse");
const { transliterate, slugify } = require("transliteration");
const asyncHandler = require("../middleware/async");
const cloudinary = require("cloudinary").v2;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

exports.create = asyncHandler(async (req, res, next) => {
  //   if (!req.body.photo) {
  //     return next(new ErrorResponse(`Please upload a file`, 400));
  //   }

  const file = req;

  // const file = req.files;
  console.log(file);

  // let result = await cloudinary.uploader.upload(file.tempFilePath, {
  //   public_id: `${Date.now()}`,
  //   folder: "Cam4RentImages",
  //   //public_id: "carcarefolders/productimages",
  //   resource_type: "auto", //jpeg,png
  // });

  // res.json({
  //   public_id: result.public_id,
  //   url: result.secure_url,
  //   //  data: result,
  // });
});

exports.remove = (req, res, next) => {
  let image_id = req.body.public_id;

  cloudinary.uploader.destroy(image_id, (err, result) => {
    if (err) return res.json({ success: false, err });
    res.send("ok");
  });
};
