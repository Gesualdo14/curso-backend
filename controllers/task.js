const Task = require("../models/task")

const get = async (req, res) => {
  console.log({ user: req.user })
  const tasks = await Task.find({ createdBy: req.user._id })

  res.status(200).json({
    ok: true,
    data: tasks,
  })
}

const create = async (req, res) => {
  const { taskName } = req.body

  const alreadyExists = await Task.exists({
    name: taskName,
  })

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

  const createdTask = await Task.create({
    name: taskName,
    createdBy: req.user._id,
  })

  res.status(201).json({
    ok: true,
    message: "Tarea creada con éxito ✅",
    data: createdTask._id,
  })
}
const update = async (req, res) => {
  const { id } = req.params
  const { taskName, completed } = req.body
  console.log({ completed, taskName })
  const updatedTask = await Task.findByIdAndUpdate(id, {
    name: taskName,
    completed,
  })

  res.status(200).json({
    ok: true,
    message: "Tarea editada con éxito ✅",
    data: updatedTask._id,
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

module.exports = { get, create, update, remove }
