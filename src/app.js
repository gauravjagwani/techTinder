const express = require("express");
const app = express();

app.get("/user/:userId", (req, res) => {
  console.log(req.params.userId);
  res.send({
    firstname: "Alpha",
    lastname: "lion",
  });
});

app.post("/hello", (req, res) => {
  res.send("POST method is used for hello route");
});

// app.use("/", (req, res) => {
//   res.send("Namaste from INDIAA!");
// });
app.listen(3000, () => {
  console.log("Starting a proj");
});
