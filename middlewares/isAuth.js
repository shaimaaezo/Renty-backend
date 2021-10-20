const jwt = require("jsonwebtoken");

module.exports = async (req, res, next) => {
  try {
    const token = await req.get("Authorization");
    if (!token) {
      return res.status(404).json({
        Message: "Not found",
      });
    }
    req.userID = token;
    console.log('token',token)
    next();
  } catch (error) {
    console.log(error);
  }
};
