const express = require("express");
const authRouter = express.Router();
const authController = require("../controller/authController");
const { wasLoggedIn } = require("../middleware/authentication");

// Ngăn người đã login vào lại login/register
authRouter.get("/login", wasLoggedIn, authController.showLoginForm);
authRouter.get("/register", wasLoggedIn, authController.showRegisterForm);
authRouter.post("/signIn", authController.signIn);
authRouter.post("/signUp", authController.signUp);
authRouter.get("/logout", authController.logOut);

module.exports = authRouter;
