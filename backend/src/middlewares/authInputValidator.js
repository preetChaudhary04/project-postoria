const User = require("../models/User");

const userRegisterInputValidator = async (req, res, next) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (
    typeof username != "string" ||
    typeof email != "string" ||
    typeof password != "string"
  ) {
    return res.status(400).json({ message: "Invalid data format" });
  }

  const trimmedUsername = username.trim();
  const trimmedEmail = email.trim();
  const trimmedPassword = password.trim();

  if ((!trimmedUsername, !trimmedEmail, !trimmedPassword)) {
    return res.status(400).json({ message: "Fields cannot be empty" });
  }

  if (trimmedUsername.length < 5 || trimmedUsername.length > 20) {
    return res
      .status(400)
      .json({ message: "Username must be 5 to 20 characters long" });
  }

  if (trimmedPassword.length < 6) {
    return res
      .status(400)
      .json({ message: "Password must be at least 6 characters" });
  }

  const isUsernameTaken = await User.findOne({ username: trimmedUsername });
  if (isUsernameTaken) {
    return res.status(400).json({ message: "Username is already taken" });
  }

  req.body.username = trimmedUsername;
  req.body.email = trimmedEmail;
  req.body.password = trimmedPassword;

  next();
};

const userLoginInputValidator = async (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  if (typeof email != "string" || typeof password != "string") {
    return res.status(400).json({ message: "Invalid data format" });
  }

  const trimmedEmail = email.trim();
  const trimmedPassword = password.trim();

  if ((!trimmedEmail, !trimmedPassword)) {
    return res.status(400).json({ message: "Fields cannot be empty" });
  }

  if (trimmedPassword.length < 6) {
    return res.status(400).json({ message: "Invalid credentials" });
  }

  req.body.email = trimmedEmail;
  req.body.password = trimmedPassword;

  next();
};

module.exports = {
  userRegisterInputValidator,
  userLoginInputValidator,
};
