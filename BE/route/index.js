const express = require("express");
const router = express.Router();

const authRoute = require("./auth");
const movieRoute = require("./movie");
const searchRoute = require("./search");
const bookingRoute = require("./bookings")

router.all("/", (req, res) => {
  return res.json({ message: "Welcome to MoviePass API", success: true });
});

router.use("/auth", authRoute);
router.use("/movie", movieRoute);
router.use("/search", searchRoute);
router.use("/booking", bookingRoute);


module.exports = router;