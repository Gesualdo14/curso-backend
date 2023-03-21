const mongoose = require("mongoose")
const { Schema } = require("mongoose")

const taskSchema = new Schema({
  name: String,
  completed: { type: Boolean, default: false },
  createdBy: { type: Schema.Types.ObjectId, ref: "User" },
})
module.exports = mongoose.model("Task", taskSchema, "Tasks")
