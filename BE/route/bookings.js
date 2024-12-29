const express = require("express");
const router = express.Router();
const bookingController = require("../controller/booking");
const tokenizer = require("../controller/tokenizer");

router.post("/book", tokenizer.authenticateToken, bookingController.bookTicket);
router.get(
  "/my-tickets",
  tokenizer.authenticateToken,
  bookingController.getBookedTickets
);
router.get(
  "/ticket/:ticketId",
  tokenizer.authenticateToken,
  bookingController.getTicketDetails
);
router.post(
  "/confirm-booking",
  tokenizer.authenticateToken,
  bookingController.confirmBooking
);

module.exports = router;