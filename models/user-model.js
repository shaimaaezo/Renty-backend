const mongoose = require("mongoose");
const UserSchema = mongoose.Schema(
  {
    role: { type: String, default: "basic", enum: ["basic", "admin"] },
    firstName: { type: String, required: [true, "Why no First Name?"] },
    lastName: { type: String, required: [true, "Why no Last Name?"] },
    email: { type: String, required: [true, "Nope! no mail no enter"] },
    password: { type: String, required: [true, "to pass put a PASSword xD"] },
    phoneNumber: { type: Number },
    profilePic: { type: String },
    rating: { type: Number },
    about: { type: String },
    address: { type: String },
    reviewsByUser: [{ type: mongoose.Schema.Types.ObjectId, ref: "FeedBack" }],
    posts: [{ type: mongoose.Schema.Types.ObjectId, ref: "Post" }],
    bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
