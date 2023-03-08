const express = require("express")
const cors = require("cors")
const { dbConnect, Task } = require("./database")
const fileUpload = require("express-fileupload")
const mime = require("mime")

const { BlobServiceClient } = require("@azure/storage-blob")

// Configurar el cliente de Azure Blob Storage
const connectionString =
  "DefaultEndpointsProtocol=https;AccountName=tuturno;AccountKey=ERq1mkptZ15nImMnVSvrJYWMXXunCW5s+6pQBvsGv9uuFDa+WIC4emQN6it/gx2v5BOfUxYthLR8+AStr1RC4A==;EndpointSuffix=core.windows.net"
const blobServiceClient =
  BlobServiceClient.fromConnectionString(connectionString)
const containerName = "tuturno"
const containerClient = blobServiceClient.getContainerClient(containerName)

dbConnect()

const app = express()

app.use(cors())
app.use(express.json())
// Configurar el middleware fileupload
app.use(
  fileUpload({
    limits: { fileSize: 50 * 1024 * 1024 }, // límite de tamaño del archivo en bytes
  })
)

app.use(
  "/",
  express.static("public", {
    setHeaders: (res, path) => {
      res.setHeader("Content-Type", mime.getType(path))
    },
  })
)

app.get("/api/tasks", async (req, res) => {
  const tasks = await Task.find()

  res.status(200).json({
    ok: true,
    message: "Tarea creada con éxito ✅",
    data: tasks,
  })
})

app.post("/api/tasks", async (req, res) => {
  console.log({ body: req.body })

  const createdTask = await Task.create({ name: req.body.taskName })

  res.status(201).json({
    ok: true,
    message: "Tarea creada con éxito ✅",
    data: createdTask._id,
  })
})

app.post("/api/tasks/:id/attach", async (req, res) => {
  const { id } = req.params
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No se ha enviado ningún archivo")
  }

  // Obtener el archivo del objeto req.files
  const file = req.files.file

  // Subir el archivo a Azure Blob Storage
  const blockBlobClient = containerClient.getBlockBlobClient(`${id}.png`)
  await blockBlobClient.upload(file.data, file.data.length, {
    blobHTTPHeaders: { blobContentType: file.mimetype },
  })

  res.json({ ok: true, data: "Archivo subido correctamente" })
})

app.delete("/api/tasks/:id", async (req, res) => {
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
