const mongoose = require("mongoose")
const { Schema, model } = require("mongoose")

const taskSchema = new Schema({
  name: String,
})

const Task = model("Task", taskSchema, "Tasks")

const dbConnect = async () => {
  try {
    const res = await mongoose.connect(
      `mongodb+srv://mgesualdo:kJLcPCbhyLyuESRX@cluster0.dw8ifrm.mongodb.net/?retryWrites=true&w=majority`
    )
    console.log("Conexión exitosa a la base de datos")
  } catch (error) {
    console.log("Hubo un error al conectarse a la base de datos", { error })
  }
}

module.exports = { dbConnect, Task }
