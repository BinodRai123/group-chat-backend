const express = require("express");
const multer = require("multer");
const Middlewares = require("../middlewares/auth.middleware");
const { v4: uuidv4 } = require("uuid");
const uploadImage = require("../services/storage.service");
const userModel = require("../models/user.model");

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

router.post("/", Middlewares, upload.single("img"), async (req, res) => {
  try {
    const image = await uploadImage(req.file, `${uuidv4()}`);

    const updatedUser = await userModel.findByIdAndUpdate(
      req.user._id,
      { $set: { profileImage: image.url } },
      { new: true }
    );

    res.json({
      message: "uploaded Image sucessful",
      image: updatedUser.profileImage,
    });
  } catch (error) {
    res.status(500).json({
      message: "something went wrong",
      error: error.message,
    });
  }
});

module.exports = router;
