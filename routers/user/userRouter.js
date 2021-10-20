const express = require("express");
const path = require('path')
const UserCtrl = require("../../controllers/user/user-ctrl");
const router = express.Router();
const isAuth = require("../../middlewares/isAuth");
const isAdmin = require("../../middlewares/isAdmin");
const upload = require("../../middlewares/upload");

router.post("/register", UserCtrl.RegisterUser);
router.post("/login", UserCtrl.LoginUser);
router.get("/user/all", isAuth, isAdmin, UserCtrl.GetAllUsers);
router.get("/user", isAuth, UserCtrl.GetUser);
router.patch("/user/update", isAuth, UserCtrl.UpdateUser);
router.delete("/user/delete/:id", isAuth, isAdmin, UserCtrl.DeleteUser);
router.patch(
  "/user/image-profile",
  isAuth,
  upload.image.single("profilePic"),
  UserCtrl.ImageProfile
);
router.use('/images',express.static(path.join(__dirname,'../../images')));

module.exports = router;
