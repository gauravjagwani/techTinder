const express = require("express");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequestModel = require("../models/connectionRequest");
const connectionSchema = require("../models/connectionRequest");

const User = require("../models/user");
const requestRouter = express.Router();

// * POST Connection Request

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    try {
      const fromUserId = req.user._id;
      const toUserId = req.params.toUserId;
      const status = req.params.status;
      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: "Invalid Status type: " + status });
      }

      //* Validation- User should not send request to himself
      /*
      if (connectionSchema.fromUserId.equals(connectionSchema.toUserId)) {
        return res.status(404).json({
          message: "Cannot send Request to Self",
        });
      }
      */

      //* Validation - User should not send request to someone who is not in User DB
      const toUser = await User.findById(toUserId);
      console.log(toUser);
      if (!toUser) {
        return res.status(400).json({
          message: "User not found",
        });
      }

      //* Validation- IF there is an existing Connection Request OR when reciever sends to Sender
      const existingConnectionRequest = await ConnectionRequestModel.findOne({
        $or: [
          {
            fromUserId,
            toUserId,
          },
          {
            fromUserId: toUserId,
            toUserId: fromUserId,
          },
        ],
      });

      if (existingConnectionRequest) {
        return res
          .status(400)
          .send({ message: "Connection Request Already Exists!!" });
      }

      const connectionRequest = new ConnectionRequestModel({
        fromUserId,
        toUserId,
        status,
      });
      const data = await connectionRequest.save();

      res.json({
        message:
          req.user.firstName + " has " + status + " to " + toUser.firstName,
        data,
      });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);

// * POST Request Review API

requestRouter.post(
  "/request/review/:status/:requestID",
  userAuth,
  async (req, res) => {
    try {
      const { status, requestID } = req.params;
      const loggedInUser = req.user;
      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res
          .status(400)
          .json({ message: status + "is not a valid status" });
      }

      const connectionRequest = await ConnectionRequestModel.findOne({
        _id: requestID,
        toUserId: loggedInUser._id,
        status: "interested",
      });
      if (!connectionRequest) {
        return res
          .status(400)
          .json({ messgage: "Connection Request not found" });
      }
      connectionRequest.status = status;

      const data = await connectionRequest.save();
      res.json({ message: "Connection request " + status, data });
    } catch (err) {
      res.status(400).send("ERROR: " + err.message);
    }
  }
);

module.exports = requestRouter;
