const express = require("express");
const playerRouter = express.Router();
const playerController = require("../controller/playerController");
playerRouter.get("/", playerController.getAllPlayer);
module.exports = playerRouter;
