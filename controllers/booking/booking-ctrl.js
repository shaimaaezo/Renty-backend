const Booking = require("../../models/booking-model");
const User = require("../../models/user-model");
const Post = require("../../models/post-model");
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "renty.manager@gmail.com",
    pass: ",c$c4UL8P'`(jztP",
  },
});

exports.CreateBooking = async (req, res) => {
  try {
    const bookingUser = await User.findById(req.userID);
    const post = await Post.findById(req.body.bookedPost);
    const ownerUser = await User.findById(post.userID);
    const checkin = new Date(req.body.checkIn);
    const checkout = new Date(req.body.checkOut);
    const calculatedAmount =
      mydiff(checkin, checkout, "days") * parseInt(post.rentalPriceUnit);
    if (post.userID.equals(req.userID)) {
      return res.status(400).json({
        error: "You book your own unit??",
      });
    }
    const booking = new Booking({
      bookingUser: req.userID,
      bookedPost: req.body.bookedPost,
      checkIn: checkin,
      checkOut: checkout,
      amount: calculatedAmount,
      adults: req.body.adults,
      children: req.body.children,
    });
    booking
      .save()
      .then((response) => {
        res.json({
          Message: "Booking done successfully",
          Data: response,
        });
      })
      .catch((err) => {
        console.log(err);
      });
    bookingUser.bookings.push(booking._id);
    post.bookings.push(booking._id);
    await bookingUser.save();
    await post.save();
    const userBooker = {
      from: "renty.manager@gmail.com",
      to: bookingUser.email,
      subject: `Reservation of ${post.titleUnit} confirmation `,
      text: `${
        post.titleUnit
      } will be ready for your staying from\n${checkin.getDate()}/${
        checkin.getMonth() + 1
      }/${checkin.getUTCFullYear()} to 
        ${checkout.getDate()}/${
        checkout.getMonth() + 1
      }/${checkout.getUTCFullYear()},
      We hope you enjoy your time!
      Renty <3`,
    };
    const postOwner = {
      from: "renty.manager@gmail.com",
      to: ownerUser.email,
      subject: `Reservation of your ${post.titleUnit}`,
      text: `Your ${post.titleUnit}, reserved by ${
        bookingUser.firstName
      }\nfrom\n${checkin.getDate()}/${
        checkin.getMonth() + 1
      }/${checkin.getUTCFullYear()} to ${checkout.getDate()}/${
        checkout.getMonth() + 1
      }/${checkout.getUTCFullYear()},
      With total amout of ${calculatedAmount}
      Renty <3 `,
    };
    transporter.sendMail(userBooker);
    transporter.sendMail(postOwner);
  } catch (error) {
    console.log(error);
  }
};

exports.GetAllBooking = async (req, res) => {
  try {
    const booking = await Booking.find();

    const page = parseInt(req.query.page);
    const limit = parseInt(req.query.limit);
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const paginateBookings = {};

    if (endIndex < booking.length) {
      paginateBookings.next = {
        page: page + 1,
        limit: limit,
      };
    }
    if (startIndex > 0) {
      paginateBookings.previous = {
        page: page - 1,
        limit: limit,
      };
    }
    paginateBookings.bookings = booking.slice(startIndex, endIndex);
    res.status(200).json({
      Message: "Bookings fetched successfully",
      NumberOfAllBookings: booking.length,
      paginateBookings,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.GetBookingOfUnit = async (req, res) => {
  try {
    const id = req.params.id;
    const booking = await Booking.findById(id);
    res.status(200).json({
      Message: "Fetched Booking successfully",
      booking,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.UpdateBooking = async (req, res) => {
  try {
    const id = req.params.id;
    const booking = await Booking.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({
      Message: "Booking updated successfully",
      booking,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.CancelBooking = (req, res) => {
  const id = req.params.id;
  Booking.findByIdAndDelete(id).then((canceledBooking) => {
    if (!canceledBooking) {
      return res.json({
        Message: "Not Found!",
        Date: null,
      });
    }
    res.json({
      Message: "Deleted!",
      Data: canceledBooking,
    });
  });
};

function mydiff(date1, date2, interval) {
  var second = 1000,
    minute = second * 60,
    hour = minute * 60,
    day = hour * 24,
    week = day * 7;
  date1 = new Date(date1);
  date2 = new Date(date2);
  var timediff = date2 - date1;
  if (isNaN(timediff)) return NaN;
  switch (interval) {
    case "years":
      return date2.getFullYear() - date1.getFullYear();
    case "months":
      return (
        date2.getFullYear() * 12 +
        date2.getMonth() -
        (date1.getFullYear() * 12 + date1.getMonth())
      );
    case "weeks":
      return Math.floor(timediff / week);
    case "days":
      return Math.floor(timediff / day);
    case "hours":
      return Math.floor(timediff / hour);
    case "minutes":
      return Math.floor(timediff / minute);
    case "seconds":
      return Math.floor(timediff / second);
    default:
      return undefined;
  }
}
