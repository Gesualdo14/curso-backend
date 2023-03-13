const getBlobContainerClient = require("../connections/blob")
const Task = require("../models/task")

const get = async (req, res) => {
  const tasks = await Task.find()

  res.status(200).json({
    ok: true,
    data: tasks,
  })
}

const create = async (req, res) => {
  console.log({ body: req.body })

  const createdTask = await Task.create({ name: req.body.taskName })

  res.status(201).json({
    ok: true,
    message: "Tarea creada con éxito ✅",
    data: createdTask._id,
  })
}

const attach = async (req, res) => {
  const { id } = req.params
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No se ha enviado ningún archivo")
  }

  // Obtener el archivo del objeto req.files
  const file = req.files.file

  const containerClient = getBlobContainerClient()

  // Subir el archivo a Azure Blob Storage
  const blockBlobClient = containerClient.getBlockBlobClient(`${id}.png`)
  await blockBlobClient.upload(file.data, file.data.length, {
    blobHTTPHeaders: { blobContentType: file.mimetype },
  })

  res.json({ ok: true, data: "Archivo subido correctamente" })
}

const remove = async (req, res) => {
  const { id } = req.params

  await Task.findByIdAndRemove(id)

  res.status(200).json({
    ok: true,
    message: "Tarea eliminada con éxito ✅",
  })
}

module.exports = { get, create, attach, remove }
