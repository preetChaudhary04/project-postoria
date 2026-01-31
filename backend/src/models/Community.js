const mongoose = require("mongoose");

const communitySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      minlength: [6, "Community name must have at least 6 characters"],
      maxlength: [20, "Community name must have at most 20 characters"],
    },
    description: {
      type: String,
      trim: true,
      default: "",
      maxlength: [300, "Desciption must have at most 300 characters"],
    },
    creator: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    members: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    membersCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

const Community = mongoose.model("Community", communitySchema);

module.exports = Community;
