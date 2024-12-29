const express = require("express");
const router = express.Router();
const tokenizer = require("../controller/tokenizer");
const userController = require("../controller/user");

const multer = require("multer");
const storage = multer.memoryStorage();
const upload = multer({ storage });

router.post("/register", userController.register);
router.post("/login", userController.login);
router
  .route("/profile")
  .get(tokenizer.authenticateToken, userController.getProfile)
  .put(
    upload.single("avatar"),
    tokenizer.authenticateToken,
    userController.updateProfile
  );

router.post("/logout", tokenizer.authenticateToken, userController.logout);

router.get("/token", tokenizer.refreshAccessToken);

module.exports = router;
