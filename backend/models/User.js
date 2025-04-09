const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  email: String,
  name: String,
  role: Number,
  permissions: [String],
  password: String // still used for login
});

module.exports = mongoose.model("User", UserSchema);
