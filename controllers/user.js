const getBlobContainerClient = require("../connections/blob")
const User = require("../models/user")

const attach = async (req, res) => {
  const { id } = req.params
  if (!req.files || Object.keys(req.files).length === 0) {
    return res.status(400).send("No se ha enviado ningún archivo")
  }

  // Obtener el archivo del objeto req.files
  const file = req.files.file

  const containerClient = getBlobContainerClient()

  // Subir el archivo a Azure Blob Storage
  const blobName = `${id}.png`
  const blockBlobClient = containerClient.getBlockBlobClient(blobName)
  await blockBlobClient.upload(file.data, file.data.length, {
    blobHTTPHeaders: { blobContentType: file.mimetype },
  })
  const blobBaseUrl = "https://tuturno.blob.core.windows.net/tuturno"
  await User.findByIdAndUpdate(id, { pictureUrl: `${blobBaseUrl}/${blobName}` })

  res.json({ ok: true, data: "Archivo subido correctamente" })
}

module.exports = { attach }
