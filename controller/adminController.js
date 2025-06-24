const Member = require("../models/members");
const Player = require("../models/playerschema");
const Team = require("../models/teams");
exports.getAllMembers = async (req, res) => {
  try {
    const members = await Member.find().lean();
    res.render("admin/accounts", { members });
  } catch (err) {
    console.error("❌ Failed to fetch members:", err);
    res.status(500).send("Server error");
  }
};
exports.getAllPlayers = async (req, res) => {
  try {
    const players = await Player.find().populate("team");
    const teams = await Team.find(); 

    res.render("admin/players", { players, teams }); 
  } catch (err) {
    console.error("❌ Get Players Error:", err);
    res.status(500).send("Server error");
  }
};