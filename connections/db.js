const mongoose = require("mongoose")

const dbConnect = async () => {
  try {
    const res = await mongoose.connect(process.env.MONGODB_URL)
    console.log("Conexión exitosa a la base de datos")
  } catch (error) {
    console.log("Hubo un error al conectarse a la base de datos", { error })
  }
}

module.exports = dbConnect
