const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

// middlewares
app.use(express.json());
app.use(cookieParser());

// importing routes
const AuthRoutes = require("./routes/AuthRoutes");
const CommunityRoutes = require("./routes/CommunityRoutes");
const PostRoutes = require("./routes/PostRoutes");

// using routes
app.use("/api/auth", AuthRoutes);
app.use("/api/community", CommunityRoutes);
app.use("/api/posts", PostRoutes);

module.exports = app;
