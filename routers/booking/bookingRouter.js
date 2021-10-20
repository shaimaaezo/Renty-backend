const express = require("express");
const BookingCtrl = require("../../controllers/booking/booking-ctrl");
const router = express.Router();
const isAuth = require("../../middlewares/isAuth");
const isAdmin = require("../../middlewares/isAdmin");

router.post("/book", isAuth, BookingCtrl.CreateBooking);
router.get("/book/all", isAuth, isAdmin, BookingCtrl.GetAllBooking);
router.get("/book/:id", isAuth, BookingCtrl.GetBookingOfUnit);
router.patch("/book/:id", isAuth, BookingCtrl.UpdateBooking);
router.delete("/book/:id", isAuth, BookingCtrl.CancelBooking);

module.exports = router;
