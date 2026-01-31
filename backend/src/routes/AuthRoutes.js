const express = require("express");
const router = express.Router();
const authInputValidator = require("../middlewares/authInputValidator");
const authControllers = require("../controllers/AuthControllers");
const authMiddleware = require("../middlewares/authMiddleware");

// register user
router.get(
  "/user/register",
  authInputValidator.userRegisterInputValidator,
  authControllers.registerUser,
);

// login user
router.post(
  "/user/login",
  authInputValidator.userLoginInputValidator,
  authControllers.loginUser,
);

// logout
router.get("/user/logout", authControllers.logoutUser);

// me route -> for frontend use
router.get("/user/me", authMiddleware, authControllers.meController);

module.exports = router;
