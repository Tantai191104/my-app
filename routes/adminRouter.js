const express = require("express");
const adminRouter = express.Router();
const teamController = require("../controller/teamController");
const { isAdmin } = require("../middleware/authentication");
adminRouter.get("/", isAdmin, teamController.getAllTeams);
adminRouter.post("/add",isAdmin,teamController.addATeam)
adminRouter.put("/edit/:teamId",isAdmin,teamController.updateTeam)
adminRouter.delete("/delete/:teamId",isAdmin,teamController.deleteATeam)
module.exports = adminRouter;
