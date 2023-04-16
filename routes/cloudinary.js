const express = require("express");

const router = express.Router();

const { protect } = require("../middleware/auth");
const { create, remove } = require("../controllers/cloudinary");

router.post("/addimages", create);

router.post("/deleteimage", remove);

//for owner

module.exports = router;
