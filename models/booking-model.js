const mongoose = require("mongoose");

const BookingSchema = mongoose.Schema({
  bookingUser: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  bookedPost: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
  checkIn: { type: Date, required: [true, "Check in date is required"] },
  checkOut: { type: Date, required: [true, "Check out date is required"] },
  amount: { type: Number, required: [true, "Total amount is required"] },
  adults: { type: Number },
  children: { type: Number, default: 0 },
});

module.exports = mongoose.model("Booking", BookingSchema);
