const mongoose = require("mongoose");
const Player = require("../models/playerschema");
exports.getAllPlayer = async (req, res) => {
  try {
    const players = await Player.find().populate("team");
    res.render("index", { players });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi server khi lấy danh sách người chơi" });
  }
};
