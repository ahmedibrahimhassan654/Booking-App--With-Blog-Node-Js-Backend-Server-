const express = require("express");
const storage = require("../../config/cloudinary");
const multer = require("multer");
const {
  postDetailsCtrl,
  createpostCtrl,
  deletepostCtrl,
  updatepostCtrl,
  fetchPostsCtrl,
  toggleLikesPostCtrl,
  toggleDisLikesPostCtrl,
} = require("../../controllers/BlogController/postCtrl");
const { protect, authorize } = require("../../middleware/auth");

const postRouter = express.Router();

//file upload middleware
const upload = multer({ storage });

//POST/api/v1/posts
postRouter.post("/", protect, upload.single("image"), createpostCtrl);

//GET/api/v1/posts/:id
postRouter.get("/:id", protect, postDetailsCtrl);

//GET/api/v1/posts/likes/:id
postRouter.get("/likes/:id", protect, toggleLikesPostCtrl);

//GET/api/v1/posts/dislikes:id
postRouter.get("/dislikes/:id", protect, toggleDisLikesPostCtrl);

//GET/api/v1/posts
postRouter.get("/", fetchPostsCtrl);

//DELETE/api/v1/posts/:id
postRouter.delete("/:id", protect, deletepostCtrl);

//PUT/api/v1/posts/:id
postRouter.put("/:id", protect, upload.single("image"), updatepostCtrl);

module.exports = postRouter;
