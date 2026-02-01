const express = require("express");
const router = express.Router();
const protected = require("../middlewares/authMiddleware");

// controller
const {
  createPost,
  getSinglePost,
  getAllPosts,
  getPostsByCommunity,
  updatePost,
  deletePost,
} = require("../controllers/PostControllers");

// routes

router.post("/", protected, createPost); // create post => protected

router.get("/:id", getSinglePost); // get single post

router.get("/", getAllPosts); // get all posts

router.get("/community/:id", getPostsByCommunity); //get posts by community

router.put("/:id", protected, updatePost);

router.delete("/:id", protected, deletePost); // delete post => protected

module.exports = router;
