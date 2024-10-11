const express = require("express");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");
const { validateEditProfileData } = require("../utils/validation");

const { validateSignUpData } = require("../utils/validation");
const profileRouter = express.Router();

//* GET Profile
profileRouter.get("/profile/view", userAuth, async (req, res) => {
  try {
    const user = req.user;
    console.log("Profile loggin success");
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

//* PATCH Profile
profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    if (!validateEditProfileData(req)) {
      throw new Error("Invalid Edit Request");
    }
    const isURLValid = validator.isURL(req.body.photoUrl);
    if (!isURLValid) {
      throw new Error("Invalid Photo URL");
    }

    const LoggedInUser = req.user;
    if (!LoggedInUser) {
      throw new Error("Invalid Edit Request");
    }

    Object.keys(req.body).forEach((key) => (LoggedInUser[key] = req.body[key]));
    await LoggedInUser.save();

    res.send(`${LoggedInUser.firstName} Data Updated Successfully`);
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

module.exports = profileRouter;
