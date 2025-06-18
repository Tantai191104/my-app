const express = require("express");
const teamRouter = express.Router();
const teamController = require("../controller/teamController");
teamRouter.get("/", teamController.getAllTeams);
teamRouter.post("/", teamController.addATeam);

module.exports = teamRouter;
