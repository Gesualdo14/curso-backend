require("dotenv").config()
const express = require("express")
const cors = require("cors")
const dbConnect = require("./connections/db")
const mime = require("mime")
const { areWeInProduction } = require("./utils/config")
const passport = require("passport")
const Task = require("./models/task")

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

// Server side rendering
app.get("/tasks", passport.authenticate("jwt"), async (req, res) => {
  const tasks = await Task.find()

  console.log({ user: req.user.toObject().pictureUrl })

  const tasksHTML = tasks.map(
    (t) =>
      `<div class="task-container">
          <div class="task" id=${t._id}>
            <p>${t.name}</p>
          </div>
          <div id="icons">
            <icon class="fas fa-edit" aria-hidden="true">
            </icon>
            <icon class="fas fa-paperclip" aria-hidden="true">
            </icon>
            <icon class="fas fa-trash" aria-hidden="true">
            </icon>
          </div>
        </div>`
  )

  const tasksPageHTML = `
  <!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Do IT</title>
    <link rel="stylesheet" href="css/styles.css" />
    <script
      src="https://kit.fontawesome.com/0631470a9c.js"
      crossorigin="anonymous"
    ></script>
    <link href="css/sweetalert2.min.css" rel="stylesheet" />
    <script src="js/sweetalert2.min.js"></script>
    <script type="module" src="index.js"></script>
    <script type="module" src="loginValidation.js"></script>
    <script type="module" src="constants.js"></script>
  </head>
  <body>
    <div id="user-profile-background" class="hidden"></div>
    <div id="ui-container" >
      <div id="user-profile" class="hidden"></div>
      <div class="header">
        <h1>App de tareas</h1>
        <img src=${
          req.user.toObject().pictureUrl
        } class="user-image" alt="" srcset="" />
      </div>
      <div class="container">
        <input type="text" name="name" placeholder="Nombre de la tarea" />
        <button type="submit">Crear tarea</button>
      </div>
      <div id="tasks">
        <input type="file" name="task-file" id="task-file" hidden />
        ${tasksHTML.join("")}
      </div>
    </div>
  </body>
</html>
  `

  res.status(200).send(tasksPageHTML)
})

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
