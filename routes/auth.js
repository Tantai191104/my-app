const express = require("express");
const authRouter = express.Router();
const authController = require("../controller/authController");
authRouter.post("/signup", authController.signUp);
authRouter.get("/login", authController.showLoginForm);
authRouter.post("/signIn", authController.signIn);
authRouter.get('/register',authController.showRegisterForm);
module.exports = authRouter;
