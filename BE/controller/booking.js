const db = require("../config/db");
const { v4: uuidv4 } = require("uuid");

// Controller for booking a ticket
const bookTicket = async (req, res) => {
  const { movieId, seats, totalPrice } = req.body;
  const userEmail = req.user.email;

  if (!movieId || !seats || !totalPrice) {
    return res
      .status(400)
      .json({
        message: "Movie ID, seats, and total price are required.",
        success: false,
      });
  }

  try {
    const bookedSeatsSnapshot = await db
      .collection("tickets")
      .where("movieId", "==", movieId)
      .get();
    const bookedSeats = [];
    bookedSeatsSnapshot.forEach((doc) => {
      bookedSeats.push(...doc.data().seats);
    });

    const unavailableSeats = seats.filter((seat) => bookedSeats.includes(seat));

    if (unavailableSeats.length > 0) {
      return res.status(400).json({
        message: `These seats are already booked: ${unavailableSeats.join(
          ", "
        )}`,
        success: false,
      });
    }

    // Add the booking to Firestore
    const ticketId = uuidv4();
    await db.collection("tickets").add({
      ticketId,
      movieId,
      userEmail,
      seats,
      totalPrice,
      bookingTime: new Date(),
      status: "booked",
    });

    res.status(201).json({
      message: "Ticket booked successfully!",
      ticketId,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

const getBookedTickets = async (req, res) => {
  const userEmail = req.user.email;

  try {
    // Get all tickets booked by the user
    const ticketsSnapshot = await db
      .collection("tickets")
      .where("userEmail", "==", userEmail)
      .get();
    const tickets = [];
    ticketsSnapshot.forEach((doc) => {
      tickets.push(doc.data());
    });

    res.status(200).json({
      tickets,
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// Controller to get the details of a specific ticket
const getTicketDetails = async (req, res) => {
  const { ticketId } = req.params;

  try {
    const ticketDoc = await db.collection("tickets").doc(ticketId).get();

    if (!ticketDoc.exists) {
      return res
        .status(404)
        .json({ message: "Ticket not found.", success: false });
    }

    res.status(200).json({
      ticket: ticketDoc.data(),
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

// Controller to confirm the booking and payment
const confirmBooking = async (req, res) => {
  const { ticketId } = req.body;

  if (!ticketId) {
    return res
      .status(400)
      .json({ message: "Ticket ID is required.", success: false });
  }

  try {
    const ticketDoc = await db.collection("tickets").doc(ticketId).get();

    if (!ticketDoc.exists) {
      return res
        .status(404)
        .json({ message: "Ticket not found.", success: false });
    }

    // Update the status to "paid"
    await db.collection("tickets").doc(ticketId).update({
      status: "paid",
      confirmationTime: new Date(),
    });

    res.status(200).json({
      message: "Booking confirmed and payment processed.",
      success: true,
    });
  } catch (error) {
    res.status(500).json({ message: error.message, success: false });
  }
};

module.exports = {
  bookTicket,
  getBookedTickets,
  getTicketDetails,
  confirmBooking,
};
