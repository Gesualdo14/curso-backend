require("dotenv").config()
const express = require("express")
const cors = require("cors")
const dbConnect = require("./connections/db")
const mime = require("mime")
const { areWeInProduction } = require("./utils/config")
const passport = require("passport")

const app = express()

/* ------------ MIDDLEWARES ---------------- */

// Controlamos desde dónde pueden llegar requests a nuestro server
app.use(cors())

// Parseamos el body de aquellas requests con Content-Type "application/json"
app.use(express.json())

// Configuramso el objeto global "passport" con las diferentes estrategias
require("./middlewares/passport")

// Configuramos express-session para el control de la cookie
app.use(
  require("express-session")({
    secret: "my-increible-secret",
    resave: true,
    saveUninitialized: true,
    cookie: {
      sameSite: areWeInProduction ? "none" : "strict",
      secure: areWeInProduction,
    },
  })
)

// Inicializamos passport (en nuevas versiones ya no es necesario)
app.use(passport.initialize())

// Configuración para servir nuestros archivos ESTATICOS, nuestra UI
app.use(
  "/",
  express.static("public", {
    setHeaders: (res, path) => {
      res.setHeader("Content-Type", mime.getType(path))
    },
    extensions: ["html", "js"],
  })
)

// Configuramos nuestras RUTAS
app.use("/api", require("./routes"))

// Conexión a la base de datos
dbConnect().then(() => {
  // Ponemos nuestra app a escuchar en algún puerto de la compu (servidor)
  const PORT = process.env.PORT || 4000
  app.listen(PORT, () => {
    console.log(`Computadora escuchando peticiones en el puerto ${PORT}`)
  })
})
