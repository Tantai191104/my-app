const express = require("express");
const playerRouter = express.Router();
const playerController = require("../controller/playerController");
playerRouter.get("/", playerController.getAllPlayer);
playerRouter.get("/:id", playerController.getPlayerById);
module.exports = playerRouter;
