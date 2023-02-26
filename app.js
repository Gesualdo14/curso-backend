const http = require("http")
const os = require("os")

const server = http.createServer((req, res) => {
  console.log({ method: req.method, url: req.url, origin: req.headers.origin })
  if (
    ["https://curso-mu.vercel.app", "http://127.0.0.1:5500"].includes(
      req.headers.origin
    )
  ) {
    res.setHeader("Access-Control-Allow-Origin", req.headers.origin)
  }
  res.setHeader("status", 200)
  res.setHeader("Content-Type", "application/json")
  res.write(
    JSON.stringify({
      ok: true,
      message: `Hola soy una compu, mi nombre es ${os.hostname()} y recibí tu petición a la ruta '${
        req.url
      }'`,
    })
  )
  res.end()
})

const PORT = process.env.PORT || 4000

server.listen(PORT, () => {
  console.log(`Computadora escuchando peticiones en el puerto ${PORT}`)
})
