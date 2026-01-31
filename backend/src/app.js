const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

// middlewares
app.use(express.json());
app.use(cookieParser());

// importing routes
const AuthRoutes = require("./routes/AuthRoutes");

// using routes
app.use("/api/auth", AuthRoutes);

module.exports = app;
