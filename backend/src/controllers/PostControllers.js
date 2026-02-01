const Community = require("../models/Community");
const Post = require("../models/Post");

const createPost = async (req, res) => {
  try {
    const { title, content, communityId } = req.body;

    if (!title || typeof title != "string") {
      return res
        .status(400)
        .json({ message: "Title field is required and in string format" });
    }

    if (content && typeof content !== "string") {
      return res
        .status(400)
        .json({ message: "Content field must be a string" });
    }

    const trimmedTitle = title.trim();
    const trimmedContent = content ? content.trim() : "";

    if (trimmedTitle.length < 3 || trimmedTitle.length > 100) {
      return res
        .status(400)
        .json({ message: "Title must be 3 to 100 characters long" });
    }

    if (trimmedContent.length > 1000) {
      return res
        .status(400)
        .json({ message: "Content must have at most 1000 characters" });
    }

    const community = await Community.findById(communityId);

    if (!community) {
      return res.status(400).json({ message: "Community not found" });
    }

    const post = new Post({
      title: trimmedTitle,
      content: trimmedContent,
      author: req.user._id,
      community: community._id,
    });

    await post.save();

    res.status(200).json({
      success: true,
      message: "Post created successfully",
      post: {
        id: post._id,
        title: post.title,
        content: post.content,
        author: req.user.username,
        community: community.name,
        createdAt: post.createdAt,
      },
    });
  } catch (err) {
    console.log("CREATE POST ERROR: ", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getSinglePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id)
      .populate("author", "username")
      .populate("community", "name");

    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }

    res.status(200).json({
      success: true,
      message: "Fetched post successfully",
      post,
    });
  } catch (err) {
    console.error("GET SINGLE POST ERROR:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find({})
      .populate("author", "username")
      .populate("community", "name")
      .sort({ createdAt: -1 });

    if (!posts) {
      return res.status(400).json({ message: "Posts not found" });
    }

    res.status(200).json({
      success: true,
      message: "Posts fetched successfully",
      posts,
    });
  } catch (err) {
    console.log("GET ALL POSTS ERROR: ", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getPostsByCommunity = async (req, res) => {
  try {
    const { id } = req.params;

    const community = await Community.findById(id);
    if (!community) {
      return res.status(400).json({ message: "Community not found" });
    }

    const posts = await Post.find({ community: id })
      .populate("author", "username")
      .populate("community", "name")
      .sort({ createdAt: -1 });

    if (!posts) {
      return res.status(400).json({ message: "Posts not found" });
    }

    res.status(200).json({
      success: true,
      message: "Posts fetched successfully",
      posts,
    });
  } catch (err) {
    console.log("GET POSTS BY COMMUNITY ERROR: ", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updatePost = async (req, res) => {
  try {
    const { id } = req.params;

    const { title, content } = req.body;

    if (!title || typeof title != "string") {
      return res
        .status(400)
        .json({ message: "Title field is required and in string format" });
    }

    if (content && typeof content !== "string") {
      return res
        .status(400)
        .json({ message: "Content field must be a string" });
    }

    const trimmedTitle = title.trim();
    const trimmedContent = content ? content.trim() : "";

    if (trimmedTitle.length < 3 || trimmedTitle.length > 100) {
      return res
        .status(400)
        .json({ message: "Title must be 3 to 100 characters long" });
    }

    if (trimmedContent.length > 1000) {
      return res
        .status(400)
        .json({ message: "Content must have at most 1000 characters" });
    }

    const post = await Post.findById(id).populate("community", "name");
    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }

    if (!post.author.equals(req.user._id)) {
      return res
        .status(400)
        .json({ message: "You are not authorized to update this post" });
    }

    post.title = trimmedTitle;
    post.content = trimmedContent;

    await post.save();

    res.status(200).json({
      success: true,
      message: "Post updated successfully",
      post: {
        id: post._id,
        title: post.title,
        content: post.content,
        author: req.user.username,
        community: post.community.name,
        createdAt: post.createdAt,
        updatedAt: post.updatedAt,
      },
    });
  } catch (err) {
    console.log("POST UPDATE ERROR: ", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

const deletePost = async (req, res) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id);
    if (!post) {
      return res.status(400).json({ message: "Post not found" });
    }

    if (!post.author.equals(req.user._id)) {
      return res
        .status(400)
        .json({ message: "You are not authorized to delete this post" });
    }

    await post.deleteOne();

    res.status(200).json({
      success: true,
      message: "Post deleted successfully",
    });
  } catch (err) {
    console.log("POST DELETE ERROR: ", err);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createPost,
  getSinglePost,
  getAllPosts,
  getPostsByCommunity,
  updatePost,
  deletePost,
};
