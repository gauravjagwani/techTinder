const express = require("express");
const bcrypt = require("bcrypt");
const validator = require("validator");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const { userAuth } = require("../middlewares/auth");
const User = require("../models/user");

const { validateSignUpData } = require("../utils/validation");
const authRouter = express.Router();

//* POST Signup
authRouter.post("/signup", async (req, res) => {
  // Validation of data
  try {
    validateSignUpData(req);
    const { firstName, lastName, emailId, password } = req.body;

    // Encrypt the password
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);

    // Creating a new instance of the User model

    const user = new User({
      firstName,
      lastName,
      emailId,
      password: passwordHash,
    });

    // Save Data on database
    await user.save();
    console.log("Data Saved");
    res.send("User Added Successfully");
  } catch (err) {
    res.status(400).send("Error creating a Profile:" + err.message);
  }
});

// * Login API
authRouter.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!validator.isEmail(emailId)) {
      throw new Error("Enter a valid mail");
    }
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const passwordHash = user.password;
    const isPasswordValid = await bcrypt.compare(password, passwordHash);

    if (isPasswordValid) {
      // Create JWT token
      const token = await user.getJWT();

      // Add token to a cookie and send response back to user
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send("Login Successfull");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("Error Logging In:" + err.message);
  }
});

module.exports = authRouter;
