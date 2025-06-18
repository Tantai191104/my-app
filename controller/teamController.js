const mongoose = require("mongoose");
const Team = require("../models/teams");
exports.getAllTeams = async (req, res) => {
  try {
    const teams = await Team.find();
    res.status(200).json({ teams });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Fail to fetch team list" });
  }
};
exports.addATeam = async (req, res) => {
  try {
    const teamName = req.body.teamName;
    console.log(teamName)
    const existingTeam = await Team.findOne({ teamName });
    if (existingTeam) {
      return res.status(400).json({ error: "Team already exists" });
    }
    const newTeam = new Team({ teamName });
    await newTeam.save();

    res.status(201).json({ message: "Team added successfully", team: newTeam });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Fail to add a team" });
  }
};
