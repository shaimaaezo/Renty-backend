const FeedBack = require("../../models/feedBack-model");
const Post = require("../../models/post-model");
const User = require("../../models/user-model");

exports.CreateFeedBack = async (req, res) => {
  try {
    const user = await User.findById(req.userID);
    const post = await Post.findById(req.body.postID);
    // Check if an array contains any element of another array in JavaScript
    const isFound = user.bookings.some((i) => post.bookings.indexOf(i) >= 0);
    if (!isFound) {
      return res.status(400).json({
        error: "Can't rate it if you never booked it",
      });
    }
    const isReviewed = user.reviewsByUser.some(
      (i) => post.reviewsAtUnit.indexOf(i) >= 0
    );
    if (isReviewed) {
      return res.status(400).json({
        Message: "Reviewd by you before",
      });
    }
    const feedBack = new FeedBack({
      rate: req.body.rate,
      review: req.body.review,
      userID: user._id,
      postID: post._id,
    });
    feedBack.save().then((response) => {
      res.status(200).json({
        Message: "Thanks for your review!",
        Data: response,
      });
    });
    user.reviewsByUser.push(feedBack._id);
    post.reviewsAtUnit.push(feedBack._id);
    post.ratingsUnit.push(req.body.rate);
    const cumulativeRating = avg(post.ratingsUnit, post.ratingsUnit.length);
    post.cumulativeRatingUnit = cumulativeRating;
    await user.save();
    await post.save();
  } catch (error) {
    console.log(error);
  }
};

exports.DeleteFeedBack = async (req, res) => {
  try {
    const id = req.params.feedid;
    FeedBack.findByIdAndDelete(id).then((deletedFeedBack) => {
      if (!deletedFeedBack) {
        return res.json({
          Message: "Not Found!",
          Date: null,
        });
      }
      res.json({
        Message: "FeedBack Deleted!",
        Data: deletedFeedBack,
      });
    });
  } catch (error) {
    console.log(error);
  }
};

// average function
function avg(arr, len) {
  let sum = 0;
  for (let i = 0; i < len; i++) {
    sum = sum + arr[i];
  }
  return sum / len;
}
