const Post = require("../../models/post-model");
const ValidatePost = require("./post-validation");
const User = require("../../models/user-model");
const nodemailer = require("nodemailer");
// const fs = require("fs");
// const { promisify } = require("util");
// const { response } = require("express");
// const unlinkAsync = promisify(fs.unlink);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "renty.manager@gmail.com",
    pass: ",c$c4UL8P'`(jztP",
  },
});

exports.CreatePost = async (req, res) => {
  try {
    // const { error } = ValidatePost.CreatePost(req.body);
    // if (error) {
    //   return res.status(400).json({ error: error.details[0].message });
    // }
    const post = new Post({
      userID: req.userID,
      titleUnit: req.body.titleUnit,
      locationUnit: req.body.locationUnit,
      descriptionUnit: req.body.descriptionUnit,
      categoryUnit: req.body.categoryUnit,
      guestsUnit: req.body.guestsUnit,
      bedroomsUnit: req.body.bedroomsUnit,
      bathroomsUnit: req.body.bathroomsUnit,
      amenitiesUnit: req.body.amenitiesUnit,
      rentalPriceUnit: req.body.rentalPriceUnit,
    });
    const user = await User.findById(req.userID);
    post
      .save()
      .then((response) => {
        res.json({
          Message: "Post created successfully",
          Data: response,
        });
      })
      .catch((err) => {
        console.log(err);
      });
    user.posts.push(post._id);
    await user.save();
    const mailOptions = {
      from: "renty.manager@gmail.com",
      to: user.email,
      subject: "Post Assessment",
      text: "Your post've been created, Its now in the assesment process!",
    };
    transporter.sendMail(mailOptions, (err) => {
      console.log(err);
    });
  } catch (err) {
    console.log(err);
  }
};

exports.GetAllPosts = async (req, res) => {
  try {
    // const page = parseInt(req.query.page);
    // const limit = parseInt(req.query.limit);
    // const startIndex = (page - 1) * limit;
    // const endIndex = page * limit;
    // const paginatedPosts = {};

    const pendingPosts = await Post.find({ statusUnit: "pending" });
    const rejectPosts = await Post.find({ statusUnit: "reject" });
    const approvePosts = await Post.find({ statusUnit: "approve" });
    const posts = await pendingPosts.concat(rejectPosts, approvePosts);

    // if (endIndex < postsDB.length) {
    //   paginatedPosts.next = {
    //     page: page + 1,
    //     limit: limit,
    //   };
    // }
    // if (startIndex > 0) {
    //   paginatedPosts.previous = {
    //     page: page - 1,
    //     limit: limit,
    //   };
    // }
    // paginatedPosts.posts = postsDB.slice(startIndex, endIndex);
    res.status(200).json({
      Message: "Posts fetched successfully",
      NumberOfAllPosts: posts.length,
      NumberOf_PendingPosts: pendingPosts.length,
      NumberOf_RejectPosts: rejectPosts.length,
      NumberOf_ApprovePosts: approvePosts.length,
      posts,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.GetPost = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Post.findById(id)
      .populate("userID", "firstName lastName profilePic about phoneNumber")
      .populate({
        path: "reviewsAtUnit",
        model: "FeedBack",
        select: "rate review",
        populate: {
          path: "userID",
          select: "firstName lastName profilePic",
        },
      });
    res.status(200).json({
      Message: "Fetched Post successfully",
      post,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.UpdatePost = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Post.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    res.status(200).json({
      Message: "Post updated successfully",
      post,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.DeletePost = (req, res) => {
  const id = req.params.id;
  Post.findByIdAndDelete(id).then((deletedPost) => {
    if (!deletedPost) {
      return res.json({
        Message: "Not Found!",
      });
    }
    res.json({
      Message: "Deleted!",
    });
  });
};

exports.UploadImage = async (req, res) => {
  try {
    // console.log(req.file);
    if (!req.file) {
      return res.status(200).json({
        Message: "No Image uploaded",
      });
    }
    const post = await Post.findById(req.params.id);
    // const oldimagesRental = post.imagesRentalUnit;
    if (post.imagesRentalUnit.length > 3) {
      return res.status(200).json({
        Message: "images limit reached",
      });
    }
    post.imagesRentalUnit.push(req.file.path);
    await post.save();
    res.status(200).json({
      Message: "Images uploaded successfully",
      Data: post.imagesRentalUnit,
    });
    // await unlinkAsync(oldimagesRental);
  } catch (error) {
    console.log(error);
  }
};

// exports.UploadImage = async (req, res) => {
//   try {
//     if (!req.files) {
//       return res.status(200).json({
//         Message: "No Image uploaded",
//       });
//     }
//     if (req.files.length === 0) {
//       return res.status(200).json({
//         Message: "No Image uploaded",
//       });
//     }
//     const post = await Post.findById(req.params.id);
//     const oldImages = arrPathsOld(
//       post.imagesRentalUnit,
//       post.imagesRentalUnit.length
//     );
//     post.imagesRentalUnit = arrPaths(req.files, req.files.length);
//     await post.save();
//     res.status(200).json({
//       Message: "Images uploaded successfully",
//       Data: post.imagesRentalUnit,
//     });
//     for (let i = 0; i < oldImages.length; i++) {
//       await unlinkAsync(oldImages[i]);
//     }
//   } catch (error) {
//     console.log(error);
//   }
// };

exports.UpdatePostStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const post = await Post.findByIdAndUpdate(
      id,
      { statusUnit: req.body.statusUnit },
      { new: true }
    );
    const user = await User.findById(post.userID);
    res.status(200).json({
      Message: "Post status changed!",
      data: post.statusUnit,
    });
    const mailOptions = {
      from: "renty.manager@gmail.com",
      to: user.email,
      subject: "Post Assessment",
      text:
        "Your post has been approved, It's now published on the website.\nWe hope you make a great profit of it\nRenty <3 ",
    };
    transporter.sendMail(mailOptions);
  } catch (error) {
    console.log(error);
  }
};

exports.GetAllApprovedPosts = async (req, res) => {
  try {
    // const page = parseInt(req.query.page);
    // const limit = parseInt(req.query.limit);
    // const startIndex = (page - 1) * limit;
    // const endIndex = page * limit;
    // const paginatedPosts = {};

    const postsDB = await Post.find({ statusUnit: "approve" }).populate(
      "userID",
      "firstName profilePic"
    );
    // if (endIndex < postsDB.length) {
    //   paginatedPosts.next = {
    //     page: page + 1,
    //     limit: limit,
    //   };
    // }
    // if (startIndex > 0) {
    //   paginatedPosts.previous = {
    //     page: page - 1,
    //     limit: limit,
    //   };
    // }
    // paginatedPosts.posts = postsDB.slice(startIndex, endIndex);
    res.status(200).json({
      Message: "Posts fetched successfully",
      NumberOfPosts_Approved: postsDB.length,
      postsDB,
    });
  } catch (error) {
    console.log(error);
  }
};

exports.SearchByLocation = async (req, res) => {
  console.log(req.body.location)
  const foundPosts = await Post.find({
    statusUnit: "approve",
    locationUnit: req.body.location,
  }).populate("userID", "firstName profilePic");
  res.status(200).json({
    Message: "Posts fetched successfully",
    whatYouSent:req.body.location,
    NumberOfPosts_match: foundPosts.length,
    foundPosts,
  });
};

// function arrPaths(ArrObjFiles, len) {
//   const arr = [];
//   for (let i = 0; i < len; i++) {
//     arr.push(ArrObjFiles[i].path);
//   }
//   return arr;
// }

// function arrPathsOld(ArrObjFiles, len) {
//   const arr = [];
//   for (let i = 0; i < len; i++) {
//     let str = new String(ArrObjFiles[i]);
//     str = str.replace(/\\/g, "\\");
//     arr.push(str);
//   }
//   return arr;
// }
