const express = require("express");
const { userAuth } = require("../middlewares/auth");
const requestRouter = express.Router();

// * POST Connection Request

requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  const user = req.user;
  console.log("Sending a connection req");

  res.send(user.firstName + " Sent the connection req");
});

module.exports = requestRouter;
