const Task = require("../models/task")

const get = async (req, res) => {
  const tasks = await Task.find()

  res.status(200).json({
    ok: true,
    data: tasks,
  })
}

const create = async (req, res) => {
  const { taskName } = req.body

  const alreadyExists = await Task.exists({ name: taskName })
  console.log({ alreadyExists })
  if (alreadyExists) {
    return res.status(400).json({
      ok: false,
      swalConfig: {
        title: "UPS",
        html: "Ya existe un nombre con esa tarea",
        confirmButtonText: "Entendido 😯",
        icon: "info",
      },
    })
  }

  const createdTask = await Task.create({ name: taskName })

  res.status(201).json({
    ok: true,
    message: "Tarea creada con éxito ✅",
    data: createdTask._id,
  })
}

const remove = async (req, res) => {
  const { id } = req.params

  await Task.findByIdAndRemove(id)

  res.status(200).json({
    ok: true,
    message: "Tarea eliminada con éxito ✅",
  })
}

module.exports = { get, create, remove }
