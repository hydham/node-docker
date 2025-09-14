const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({
  title: {
    type: String,
    require: [true, "title is required"],
  },
  body: {
    type: String,
    require: [true, "body is required"],
  },
});

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
