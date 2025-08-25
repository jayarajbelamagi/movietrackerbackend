const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: String,
  password: String, // keeping it simple (no bcrypt)
});

module.exports = mongoose.model("User", UserSchema);
