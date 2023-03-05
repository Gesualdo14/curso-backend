const express = require("express")
const cors = require("cors")
const { dbConnect, Task } = require("./database")

dbConnect()

const app = express()

app.use(cors())
app.use(express.json())

app.get("/tasks", async (req, res) => {
  const tasks = await Task.find()

  res.status(200).json({
    ok: true,
    message: "Tarea creada con éxito ✅",
    data: tasks,
  })
})

app.post("/tasks", async (req, res) => {
  console.log({ body: req.body })

  const createdTask = await Task.create({ name: req.body.taskName })

  res.status(201).json({
    ok: true,
    message: "Tarea creada con éxito ✅",
    data: createdTask._id,
  })
})

app.delete("/tasks/:id", async (req, res) => {
  const { id } = req.params

  await Task.findByIdAndRemove(id)

  res.status(200).json({
    ok: true,
    message: "Tarea eliminada con éxito ✅",
  })
})

const PORT = process.env.PORT || 4000

app.listen(PORT, () => {
  console.log(`Computadora escuchando peticiones en el puerto ${PORT}`)
})
