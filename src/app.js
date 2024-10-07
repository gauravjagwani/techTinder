const express = require("express");

const app = express();
const connectDB = require("./config/database");

app.use(express.json());
const User = require("./models/user");

//* POST API for signup
app.post("/signup", (req, res) => {
  console.log(req.body);

  // Creating a new instance of the User model

  const user = new User(req.body);

  // Save Data on database
  user
    .save()
    .then(() => {
      {
        console.log("Data Saved");
        res.send("User Added Successfully");
      }
    })
    .catch((err) => {
      res.status(400).send("Error saving the User:" + err.message);
    });
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

app.patch("/user", async (req, res) => {
  const userId = req.body.userId;
  const data = req.body;
  try {
    const user = await User.findByIdAndUpdate({ _id: userId }, data);
    res.send("User Updated Successfully");
  } catch (err) {
    res.status(404).send("Something went Wrong");
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
