const express = require("express");
const app = express();
app.use("/test", (req, res) => {
  res.send("Hello from server!");
});
app.use("/", (req, res) => {
  res.send("Namaste from INDIAA!");
});
app.listen(3000, () => {
  console.log("Starting a proj");
});
