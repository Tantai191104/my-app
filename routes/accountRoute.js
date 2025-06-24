const express = require("express");
const accountRouter = express.Router();
const adminController = require("../controller/adminController");
const { isAdmin } = require("../middleware/authentication");
accountRouter.get("/", isAdmin, adminController.getAllMembers);

module.exports = accountRouter;
