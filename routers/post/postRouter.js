const express = require("express");
const path = require('path')
const PostCtrl = require("../../controllers/post/post-ctrl");
const router = express.Router();
const isAuth = require("../../middlewares/isAuth");
const isAdmin = require("../../middlewares/isAdmin");
const upload = require("../../middlewares/upload");
const isSameUser = require("../../middlewares/isSameUser");

router.post("/post/create", isAuth, PostCtrl.CreatePost);
router.get("/post/all", isAuth, isAdmin, PostCtrl.GetAllPosts);
router.get("/post/:id", PostCtrl.GetPost);
router.patch("/post/update/:id", isAuth, isSameUser, PostCtrl.UpdatePost);
router.delete("/post/delete/:id", isAuth, isSameUser, PostCtrl.DeletePost);
router.patch(
  "/post/images-upload/:id",
  isAuth,
  isSameUser,
  upload.image.single("imagesRentalUnit"),
  PostCtrl.UploadImage
);
router.patch(
  "/post/pendeing-action/:id",
  isAuth,
  isAdmin,
  PostCtrl.UpdatePostStatus
);
router.get("/post/all/approved", PostCtrl.GetAllApprovedPosts);
router.post("/post/all/search", PostCtrl.SearchByLocation);
router.use('/images',express.static(path.join(__dirname,'../../images')));


module.exports = router;
