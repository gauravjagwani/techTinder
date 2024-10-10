const express = require("express");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");

const { validateSignUpData } = require("../utils/validation");
const profileRouter = express.Router();

profileRouter.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    console.log("Profile loggin success");
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});
module.exports = profileRouter;
