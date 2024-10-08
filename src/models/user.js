const mongoose = require("mongoose");
const validator = require("validator");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: [2, "Firstname should be of atleast 2 characters!"],
    },
    lastName: { type: String },
    emailId: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      validate(value) {
        if (!validator.isEmail(value)) {
          throw new Error("Invalid Email ID: " + value);
        }
      },
    },
    password: {
      type: String,
      required: true,
    },
    age: {
      type: Number,
      min: [18, "Users under 18 years of age are restricted to create account"],
    },
    gender: {
      type: String,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Add valid gender");
        }
      },
    },
    photoUrl: {
      type: String,
      validate(value) {
        if (!validator.isURL(value)) {
          throw new Error("Invalid URL: " + value);
        }
      },
    },
    about: {
      type: String,
      default: "This is default description of the user",
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);
// Creating a new model that is a user
const User = mongoose.model("User", userSchema);

module.exports = User;
