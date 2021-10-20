const jwt = require("jsonwebtoken");
const { registerValidation, loginValidation } = require("./user-validation");
const User = require("../../models/user-model");
const bcrypt = require("bcrypt");
const fs = require("fs");
const { promisify } = require("util");
const unlinkAsync = promisify(fs.unlink);

exports.RegisterUser = async (req, res) => {
  /* validation of the user data @ register */

  const { error } = registerValidation(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  const emailExist = await User.findOne({ email: req.body.email });
  if (emailExist) {
    return res.status(400).json({ error: "Email already used" });
  }
  const password = await bcrypt.hash(req.body.password, 12);

  /* Adding the user to database */

  const user = new User();
  user.firstName = req.body.firstName;
  user.lastName = req.body.lastName;
  user.email = req.body.email;
  user.password = password;

  user.save();
  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET
  );
  res.status(200).header("Authorization", token).json({
    Message: "User registered",
    token: token,
  });
};

exports.LoginUser = async (req, res) => {
  const { error } = loginValidation(req.body);
  if (error) {
    return res.status(400).json({ error: error.details[0].message });
  }
  const user = await User.findOne({ email: req.body.email });
  if (!user) {
    return res.status(400).json({ error: "Wrong User" });
  }
  const validatePassword = await bcrypt.compare(
    req.body.password,
    user.password
  );
  if (!validatePassword) {
    return res.status(400).json({ error: "Wrong Password" });
  }
  /* JWT Generate */
  const token = jwt.sign(
    {
      id: user._id,
      role: user.role,
    },
    process.env.JWT_SECRET
  );
  res.header("Authorization", token).json({
    Message: "User logged in",
    token: token,
  });
};

exports.GetAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      Message: "Fetched Users successfully",
      NumberOfUsers: users.length,
      users,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.GetUser = async (req, res) => {
  try {
    const user = await User.findById(req.userID)
      .populate({
        path: "posts",
        populate: {
          path: "reviewsAtUnit",
          model: "FeedBack",
        },
        populate: {
          path: "bookings",
          model: "Booking",
          select: "checkIn checkOut amount adults",
          populate: {
            path: "bookedPost",
            model: "Post",
            select: "titleUnit",
          },
          populate: {
            path: "bookingUser",
            model: "User",
            select: "firstName lastName email phoneNumber profilePic",
          },
        },
      })
      .populate({
        path: "bookings",
        select: "checkIn checkOut amount",
        populate: {
          path: "bookedPost",
          select: "titleUnit",
        },
      });
    res.status(200).json({
      Message: "Fetched the User successfully",
      Data: user,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.UpdateUser = async (req, res) => {
  try {
    const user = await User.findByIdAndUpdate(req.userID, req.body, {
      new: true,
    });
    res.status(200).json({
      Message: "User updated successfully",
      user,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.DeleteUser = (req, res) => {
  const id = req.params.id;
  User.findByIdAndDelete(id).then((deletedUser) => {
    if (!deletedUser) {
      return res.json({
        Message: "Not Found!",
        Date: null,
      });
    }
    res.json({
      Message: "Deleted!",
      Data: deletedUser,
    });
  });
};

exports.ImageProfile = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(200).json({
        Message: "No Image uploaded",
      });
    }
    const user = await User.findById(req.userID);
    const oldProfilePic = user.profilePic;
    user.profilePic = req.file.path;
    await user.save();
    res.status(200).json({
      Message: "Profile image uploaded successfully",
      Data: user.profilePic,
    });
    await unlinkAsync(oldProfilePic);
  } catch (error) {
    console.log(error);
  }
};
