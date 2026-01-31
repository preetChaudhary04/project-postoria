const Community = require("../models/Community");

const createCommunity = async (req, res) => {
  try {
    const { name, description } = req.body;

    if (!name || typeof name !== "string") {
      return res
        .status(400)
        .json({ message: "Community name is required and must be a string" });
    }

    if (description && typeof description !== "string") {
      return res.status(400).json({
        message: "Description must be a string",
      });
    }

    const trimmedName = name.trim().toLowerCase();
    const trimmedDescription = description ? description.trim() : "";

    if (!name) {
      return res
        .status(400)
        .json({ message: "Community name cannot be empty" });
    }

    if (trimmedName.length < 6 || trimmedName.length > 20) {
      return res
        .status(400)
        .json({ message: "Community name must be 5 to 20 characters long" });
    }

    if (trimmedDescription.length > 300) {
      return res.status(400).json({
        message: "Description must have at most 300 characters",
      });
    }

    const doesCommunityExist = await Community.findOne({ name: trimmedName });
    if (doesCommunityExist) {
      return res.status(400).json({ message: "Community already exists" });
    }

    const community = new Community({
      name: trimmedName,
      description: trimmedDescription,
      creator: req.user._id,
      members: [req.user._id],
      membersCount: 1,
    });

    await community.save();

    res.status(200).json({
      success: true,
      message: "Community created successfully",
      community: {
        id: community._id,
        name: community.name,
        description: community.description,
        creator: req.user.username,
        membersCount: community.membersCount,
      },
    });
  } catch (err) {
    console.log("CREATE COMMUNITY ERROR: ", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getAllCommunities = async (req, res) => {
  try {
    const communities = await Community.find({})
      .select("name description creator membersCount createdAt")
      .populate("creator", "username")
      .sort({ createdAt: -1 });
    if (!communities || communities.length === 0) {
      return res.status(400).json({ message: "Communites cannot be found" });
    }

    res.status(200).json({
      success: true,
      message: "Success",
      count: communities.length,
      communities,
    });
  } catch (err) {
    console.log("GET ALL COMMUNITIES ERROR: ", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const getCommunityByName = async (req, res) => {
  try {
    const { name } = req.params;

    if (!name) {
      return res.status(400).json({
        message: "Community name is required",
      });
    }

    const community = await Community.findOne({ name })
      .select("name description creator membersCount createdAt")
      .populate("creator", "username");

    if (!community) {
      return res.status(400).json({ message: "Community not found" });
    }

    res.status(200).json({
      success: true,
      message: "Community found",
      community,
    });
  } catch (err) {
    console.log("GET COMMUNITY BY NAME ERROR: ", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const updateCommunity = async (req, res) => {
  try {
    const { id } = req.params;
    const { description } = req.body;

    const community = await Community.findById(id);
    if (!community) {
      return res.status(400).json({ message: "Community not found" });
    }

    if (!community.creator.equals(req.user._id)) {
      return res
        .status(400)
        .json({ message: "You are not authorized to update this community" });
    }

    if (description !== undefined) {
      if (typeof description !== "string") {
        return res
          .status(400)
          .json({ message: "Description must be a string" });
      }
    }

    community.description = description.trim();

    await community.save();

    res.status(200).json({
      success: true,
      message: "Update success",
      community: {
        id: community._id,
        name: community.name,
        description: community.description,
        creator: req.user.username,
        membersCount: community.membersCount,
        createdAt: community.createdAt,
      },
    });
  } catch (err) {
    console.log("UPDATE COMMUNITY ERROR: ", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const deleteCommunity = async (req, res) => {
  try {
    const { id } = req.params;

    const community = await Community.findById(id);

    if (!community) {
      return res.status(400).json({ message: "Community not found" });
    }

    if (!community.creator.equals(req.user._id)) {
      return res
        .status(400)
        .json({ message: "You are not authorized to delete this community" });
    }

    await community.deleteOne();

    res.status(200).json({
      success: true,
      message: "Community deleted successfully",
    });
  } catch (err) {
    console.log("COMMUNITY DELETE ERROR: ", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const joinCommunity = async (req, res) => {
  try {
    const { id } = req.params;

    const community = await Community.findById(id);

    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    if (community.members.includes(req.user._id)) {
      return res.status(400).json({ message: "You are already a member" });
    }

    community.members.push(req.user._id);
    community.membersCount += 1;

    await community.save();

    res.status(200).json({
      success: true,
      message: "Joined community",
      membersCount: community.membersCount,
    });
  } catch (err) {
    console.log("JOIN COMMUNITY ERROR: ", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

const leaveCommunity = async (req, res) => {
  try {
    const { id } = req.params;

    const community = await Community.findById(id);

    if (!community) {
      return res.status(404).json({ message: "Community not found" });
    }

    if (community.creator.equals(req.user._id)) {
      return res.status(400).json({
        message: "Community creator cannot leave the community",
      });
    }

    if (!community.members.includes(req.user._id)) {
      return res.status(400).json({
        message: "You are not a member of this community",
      });
    }

    community.members = community.members.filter(
      (memberId) => !memberId.equals(req.user._id),
    );
    community.membersCount -= 1;

    await community.save();

    res.status(200).json({
      success: true,
      message: "Left community successfully",
      membersCount: community.membersCount,
    });
  } catch (err) {
    console.log("LEAVE COMMUNITY ERROR: ", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

module.exports = {
  createCommunity,
  getAllCommunities,
  getCommunityByName,
  updateCommunity,
  deleteCommunity,
  joinCommunity,
  leaveCommunity,
};
