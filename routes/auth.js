const express = require("express");
const authRouter = express.Router();
const authController = require("../controller/authController");
authRouter.post("/signup", authController.SignUp);

module.exports = authRouter;
