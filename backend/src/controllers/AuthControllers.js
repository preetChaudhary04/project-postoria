const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const doesUserAlreadyExist = await User.findOne({ email });
    if (doesUserAlreadyExist) {
      res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ username, email, password: hashedPassword });
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "User registered successfully",
      user: {
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.log("USER REGISTER ERROR: ", err);
    res.status(400).json({ message: "User registration failed" });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      res.status(400).json({ message: "User not found" });
    }

    const isMatch = bcrypt.compare(password, user.password);
    if (!isMatch) {
      res.status(401).json({ message: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET_KEY, {
      expiresIn: "7d",
    });

    res.cookie("token", token, {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
      },
    });
  } catch (err) {
    console.log("USER LOGIN ERROR: ", err);
    res.status(400).json({ message: "Login failed" });
  }
};

const logoutUser = (req, res) => {
  try {
    res.cookie("token", "", {
      httpOnly: true,
      sameSite: "lax",
      secure: false,
      path: "/",
      expiresIn: new Date(0),
    });

    res.status(200).json({ message: "Logout successful" });
  } catch (err) {
    console.log("USER LOGOUT ERROR: ", err);
    res.status(400).json({ message: "Logout failed" });
  }
};

const meController = (req, res) => {
  res.status(200).json({
    message: "User logged in",
    user: {
      id: req.user._id,
      username: req.user.username,
      email: req.user.email,
    },
  });
};

module.exports = { registerUser, loginUser, logoutUser, meController };
