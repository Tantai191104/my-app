const mongoose = require("mongoose");
const Player = require("../models/playerschema");
const Team = require("../models/teams");
exports.getAllPlayer = async (req, res) => {
  const { search, team } = req.query;
  const query = {};

  if (search && search.trim()) {
    query.playerName = { $regex: search, $options: "i" };
  }

  if (team && mongoose.Types.ObjectId.isValid(team)) {
    query.team = mongoose.Types.ObjectId.createFromHexString(team);
  }

  try {
    console.log("Search Query:", query);
    const players = await Player.find(query).populate("team");
    const teams = await Team.find();
    res.render("index", { players, teams, query });
  } catch (error) {
    console.error("getAllPlayer error:", error);
    res.status(500).send("Lỗi server: " + error.message);
  }
};
exports.getPlayerById = async (req, res) => {
  if (!mongoose.Types.ObjectId.isValid(req.params.id)) {
    return res.status(400).send("Invalid ID");
  }
  try {
    const player = await Player.findById(req.params.id).populate("team");
    if (!player) {
      res.status(404).json({ status: flase, message: "player not found" });
    }
    console.log("Player detail:", player);
    res.render("playerDetail", { player });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Lỗi server khi lấy danh sách người chơi" });
  }
};
