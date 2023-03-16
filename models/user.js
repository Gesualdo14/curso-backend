const mongoose = require("mongoose")
const { Schema } = require("mongoose")

const userSchema = new Schema({
  email: String,
  loginCode: String,
  pictureUrl: String,
})

module.exports = mongoose.model("User", userSchema, "Users")
