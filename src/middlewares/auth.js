const express = require("express");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const app = express();
const User = require("../models/user");

app.use(express.json());
app.use(cookieParser());

const userAuth = async (req, res, next) => {
  try {
    // Read the token from the request

    const { token } = req.cookies;
    // Validate the token

    if (!token) {
      throw new Error("Invalid Token");
    }

    const decodedObj = await jwt.verify(token, "Tech@Tinder90");
    const { _id } = decodedObj;
    const user = await User.findById(_id);
    // Find the user
    req.user = user;
    if (!user) {
      throw new Error("User does not exist");
    }
    next();
  } catch (err) {
    res.status(400).send("ERROR:" + err.message);
  }
};

module.exports = {
  userAuth,
};
