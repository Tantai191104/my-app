const express = require("express");
const playerRouter = express.Router();
const playerController = require("../controller/playerController");
const adminController = require("../controller/adminController")
const { isLoggedIn, isAdmin } = require("../middleware/authentication");
playerRouter.get("/", isAdmin, adminController.getAllPlayers);
playerRouter.post("/:id/comment", isLoggedIn, playerController.addFeedback);
playerRouter.get("/:id", playerController.getPlayerById);
playerRouter.put("/edit/:playerId",isAdmin,playerController.updatePlayer)
playerRouter.delete("/delete/:playerId",isAdmin,playerController.deletePlayer)
module.exports = playerRouter;
