const Post = require("../models/post-model");
module.exports = async (req,res,next)=>{
    const post = await Post.findById(req.params.id);
    if (post.userID.equals(req.userID)) {
        next();
      } else if(req.role === "admin"){
          next();
      } else {
        res.status(403).json({
          error: "Unauthorized user",
        });
      }
}