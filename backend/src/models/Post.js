const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
      trim: true,
      minlength: [3, "Title must have at least 3 characters"],
      maxlength: [100, "Title must have at most 100 characters"],
    },
    content: {
      type: String,
      default: "",
      trim: true,
      maxlength: [1000, "Content must have at most 1000 characters"],
    },
    author: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    community: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Community",
      required: true,
    },
  },
  { timestamps: true },
);

const Post = mongoose.model("Post", postSchema);

module.exports = Post;
