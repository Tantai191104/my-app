const Teams = require("../models/teams");

exports.getAllTeams = async (req, res) => {
  try {
    const teams = await Teams.find();
    res.render("admin/teams", { teams });
  } catch (err) {
    console.error("❌ Render error:", err.stack);
    res.status(500).send("Render failed");
  }
};

exports.addATeam = async (req, res) => {
  try {
    const teamName = req.body.teamName;

    const existingTeam = await Teams.findOne({ teamName });
    if (existingTeam) {
      req.session.message = { type: "warning", text: "Team already exists" };
      return res.redirect("/teams");
    }

    const newTeam = new Teams({ teamName });
    await newTeam.save();

    req.session.message = { type: "success", text: "Team added successfully" };
    res.redirect("/teams");
  } catch (error) {
    console.error(error);
    req.session.message = { type: "warning", text: "Fail to add team" };
    res.redirect("/teams");
  }
};

exports.updateTeam = async (req, res) => {
  try {
    const { teamName } = req.body;
    await Teams.findByIdAndUpdate(req.params.teamId, { teamName });
    req.session.message = {
      type: "success",
      text: "Team updated successfully.",
    };
    res.redirect("/teams");
  } catch (error) {
    console.error("Update error:", error);
    req.session.message = { type: "error", text: "Fail to edit" };
  }
};

exports.deleteATeam = async (req, res) => {
  try {
    await Teams.findByIdAndDelete(req.params.teamId);
    req.session.message = {
      type: "success",
      text: "Team deleted successfully.",
    };
    res.redirect("/teams");
  } catch (error) {
    console.error("Delete error:", error);
    req.session.message = {
      type: "danger",
      text: "Failed to delete team.",
    };
    res.redirect("/teams");
  }
};