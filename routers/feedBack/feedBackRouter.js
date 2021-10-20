const express = require("express");
const router = express.Router();
const isAuth = require("../../middlewares/isAuth");
const isAdmin = require("../../middlewares/isAdmin");
const feedBackCtrl = require("../../controllers/feedBack/feedBack-ctrl");

router.post("/feedback", isAuth, feedBackCtrl.CreateFeedBack);
router.delete("/feedback/:feedid", isAuth, isAdmin, feedBackCtrl.DeleteFeedBack);

module.exports = router;
