const fileUpload = require("express-fileupload")

const filesMid = fileUpload({
  limits: { fileSize: 50 * 1024 * 1024 }, // límite de tamaño del archivo en bytes
})

module.exports = filesMid
