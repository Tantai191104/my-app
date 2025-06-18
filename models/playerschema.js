const mongoose = require("mongoose");
const commentSchema = require("../models/comments"); // Đây phải export là schema, không phải model

const Schema = mongoose.Schema;

const playerschema = new Schema(
  {
    playerName: { type: String, required: true },
    image: { type: String, required: true },
    cost: { type: Number, required: true },
    isCaptain: { type: Boolean, default: false },
    information: { type: String, required: true },
    comments: [commentSchema],
    team: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Teams",
      required: true,
    },
  },
  { timestamps: true }
);

const Player = mongoose.model("Player", playerschema);
module.exports = Player;
