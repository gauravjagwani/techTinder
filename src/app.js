const express = require("express");

const app = express();
const connectDB = require("./config/database");

app.use(express.json());
const User = require("./models/user");

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
