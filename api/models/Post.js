const mongoose = require("mongoose");

const PostSchema = mongoose.Schema(
  {
    img: { type: Object, required: true },
    comment: { type: String, required: true },
  },
  { timestamps: true }
);

const Post = mongoose.model("post", PostSchema);
module.exports = Post;