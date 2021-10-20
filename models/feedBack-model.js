const mongoose = require("mongoose");

const FeedBackSchema = mongoose.Schema(
  {
    rate: { type: Number, required: true },
    review: { type: String },
    userID: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    postID: { type: mongoose.Schema.Types.ObjectId, ref: "Post" },
  },
  { timestamps: true }
);
module.exports = mongoose.model("FeedBack", FeedBackSchema);
