const express = require("express");
const router = express.Router();
const protected = require("../middlewares/authMiddleware");

// controller
const {
  createCommunity,
  getAllCommunities,
  getCommunityByName,
  updateCommunity,
  deleteCommunity,
  joinCommunity,
  leaveCommunity,
} = require("../controllers/CommunityControllers");

// routes

router.post("/", protected, createCommunity); // create community => protected

router.get("/", getAllCommunities); // get all communities

router.get("/:name", getCommunityByName); // get community by name

router.put("/:id", protected, updateCommunity); // update community => protected

router.delete("/:id", protected, deleteCommunity); // delete community => protected

router.get("/:id/join", protected, joinCommunity); // join community => protected

router.get("/:id/leave", protected, leaveCommunity); // leave community => protected

module.exports = router;
