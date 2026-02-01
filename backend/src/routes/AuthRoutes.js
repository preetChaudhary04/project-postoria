const express = require("express");
const router = express.Router();
const protected = require("../middlewares/authMiddleware");
const {
  userRegisterInputValidator,
  userLoginInputValidator,
} = require("../middlewares/authInputValidator");

// controller
const {
  registerUser,
  loginUser,
  logoutUser,
  meController,
} = require("../controllers/AuthControllers");

// routes

router.get("/user/register", userRegisterInputValidator, registerUser); // register user

router.post("/user/login", userLoginInputValidator, loginUser); // login user

router.get("/user/logout", logoutUser); // logout

router.get("/user/me", protected, meController); // me route -> for frontend use (protected)

module.exports = router;
