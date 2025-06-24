const express = require("express");
const memberRouter = express.Router();
const memberController = require("../controller/memberController");

const { isLoggedIn } = require("../middleware/authentication");

memberRouter.get("/profile", isLoggedIn, memberController.showProfile);

memberRouter.post("/updateProfile", isLoggedIn, memberController.updateProfile);

memberRouter.post(
  "/change-password",
  isLoggedIn,
  memberController.changePassword
);

module.exports = memberRouter;
