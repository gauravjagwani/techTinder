const express = require("express");
const bcrypt = require("bcrypt");
const validator = require("validator");

const { validateSignUpData } = require("./utils/validation");

const app = express();
const connectDB = require("./config/database");

app.use(express.json());
const User = require("./models/user");

//* POST API for signup
app.post("/signup", async (req, res) => {
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

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;

    if (!validator.isEmail(emailId)) {
      throw new Error("Enter a valid mail");
    }
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      throw new Error("Invalid Credentials");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (isPasswordValid) {
      res.send("Login Successfull");
    } else {
      throw new Error("Invalid Credentials");
    }
  } catch (err) {
    res.status(400).send("Error Logging In:" + err.message);
  }
});

// * GET user API
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;
  try {
    const user = await User.find({
      emailId: userEmail,
    });
    if (user.length === 0) {
      res.status(401).send("User not found");
    } else {
      res.send(user);
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

// * Feed API - GET / feed- get all the users from the database
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

//* Delete API

app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    res.send("User deleted Successfully");
  } catch (err) {
    res.status(404).send("Something went Wrong");
  }
});

//* Update API

app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;

  try {
    const ALLOWED_UPDATES = [
      "userId",
      "password",
      "about",
      "photoUrl",
      "skills",
    ];
    const isAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );

    if (!isAllowed) {
      throw new Error("Not allowed to update the field");
    }
    if (data.skills.length > 10) {
      throw new Error("More than 10 skills not allowed");
    }
    const user = await User.findByIdAndUpdate({ _id: userId }, data);
    res.send("User Updated Successfully");
  } catch (err) {
    res.status(404).send("UPDATE FAILED:" + err.message);
  }
});

connectDB()
  .then(() => {
    console.log("Database connection established");
    app.listen(3000, () => {
      console.log("Starting a proj");
    });
  })
  .catch((err) => {
    console.log("database cannot be connected");
  });
