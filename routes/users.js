const express = require("express");
const {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  profilePhotoUploadCtrl,
  whoViewedMyProfileCtrl,
  followingCtrl,
  unFollowCtrl,
  blockUsersCtrl,
  adminUnblockUserCtrl,
  adminBlockUserCtrl,
  unblockUserCtrl,
  updatePasswordCtrl,
  deleteUserAccountCtrl,
} = require("../controllers/users");
const storage = require("../config/cloudinary");
const multer = require("multer");
const User = require("../models/User");

const router = express.Router();

const advancedResults = require("../middleware/advancedResults");
const { protect, authorize } = require("../middleware/auth");
//instance of multer
const upload = multer({ storage });
// router.use(protect);
// router.use(authorize('admin'));

router.route("/").get(getUsers).post(protect, authorize("admin"), createUser);

router
  .route("/:id")
  .get(getUser)
  .put(protect, authorize("admin"), updateUser)
  .delete(protect, authorize("admin"), deleteUser);
router.post(
  "/profile-photo-upload",
  protect,
  upload.single("profile"),
  profilePhotoUploadCtrl
);

//GET/api/v1/users/profile-viewers/:id
router.get("/profile-viewers/:id", protect, whoViewedMyProfileCtrl);
//GET/api/v1/users/following/:id
router.get("/following/:id", protect, followingCtrl);

//GET/api/v1/users/unfollow/:id
router.get("/unfollowing/:id", protect, unFollowCtrl);

//GET/api/v1/users/block/:id
router.get("/block/:id", protect, blockUsersCtrl);

//GET/api/v1/users/unblock/:id
router.get("/unblock/:id", protect, unblockUserCtrl);

//PUT/api/v1/users/admin-block/:id
router.put("/admin-block/:id", protect, authorize("admin"), adminBlockUserCtrl);

//PUT/api/v1/users/admin-unblock/:id
router.put(
  "/admin-unblock/:id",
  protect,
  authorize("admin"),
  adminUnblockUserCtrl
);

//PUT/api/v1/users/unblock/:id
router.put("/update-password", protect, updatePasswordCtrl);

//DELETE/api/v1/users/unblock/:id
router.delete("/delete-account", protect, deleteUserAccountCtrl);

module.exports = router;
