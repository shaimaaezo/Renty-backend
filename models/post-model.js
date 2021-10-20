const mongoose = require("mongoose");

const PostSchema = mongoose.Schema(
  {
    statusUnit: {
      type: String,
      default: "pending",
      enum: ["pending", "reject", "approve"],
    },
    userID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    titleUnit: { type: String, required: [true, "Why no Title?"] },
    locationUnit: { type: String, required: [true, "Why no Location?"] },
    categoryUnit: { type: String, required: [true, "Why no Category?"] },
    guestsUnit: { type: Number, required: [true, "Why no limit for guests"] },
    bedroomsUnit: { type: Number, required: [true, "No Bedrooms??"] },
    bathroomsUnit: { type: Number, required: [true, "NOO BATHROMS"] },
    amenitiesUnit: [String],
    ratingsUnit: [{ type: Number }],
    cumulativeRatingUnit: { type: Number },
    descriptionUnit: { type: String },
    reviewsAtUnit: [{ type: mongoose.Schema.Types.ObjectId, ref: "FeedBack" }],
    imagesRentalUnit: [{ type: String }],
    rentalPriceUnit: { type: Number },
    bookings: [{ type: mongoose.Schema.Types.ObjectId, ref: "Booking" }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Post", PostSchema);
