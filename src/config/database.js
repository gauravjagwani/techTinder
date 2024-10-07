const mongoose = require("mongoose");

const connectDB = async () => {
  await mongoose.connect(
    "mongodb+srv://gauravjagwani18:yKs9Yf4VxbTGKNLH@nodejs.moxk2.mongodb.net/techTinder"
  );
};

module.exports = connectDB;
