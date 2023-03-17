// const isDev = ["localhost", "127.0.0.1"].includes(window.location.hostname)
// const backendUrl = isDev
//   ? "http://localhost:4000/api"
//   : "https://curso-backend.onrender.com/api"
import backendUrl from "./constants"

const codeBtn = document.getElementById("code-btn")
const loginBtn = document.getElementById("login-btn")
const emailInput = document.getElementById("email-input")
const codeInput = document.getElementById("code-input")

codeBtn.addEventListener("click", async () => {
  const email = emailInput.value
  codeBtn.innerText = "Enviando..."
  console.log({ email })
  const res = await fetch(`${backendUrl}/auth/code/${email}`)
  const resJSON = await res.json()

  if (resJSON.ok) {
    Swal.fire({
      title: "Listo",
      html: "Código enviado con éxito, revisa tu correo",
      icon: "success",
      confirmButtonText: "Entendido",
    })
    codeBtn.classList.add("hidden")
    codeBtn.innerText = "Quiero un código"
    loginBtn.classList.remove("hidden")
  } else {
    Swal.fire("UPS", "Hubo un error al solicitar el código", "warning")
  }
  console.log({ resJSON })
})

loginBtn.addEventListener("click", loginHandler)

async function loginHandler(e) {
  e.preventDefault()
  console.log({ e })
  const email = emailInput.value
  const code = codeInput.value
  if (!email || !code) {
    Swal.fire("UPS", "Debes rellenar ambos campos para ingresar", "info")
    return
  }
  loginBtn.innerText = "Ingresando..."

  const res = await fetch(`${backendUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" }, // necesario para que no sea BAD REQUEST
    body: JSON.stringify({ email, code }),
  })
  if (res.ok) {
    const resJSON = await res.json()
    localStorage.setItem("user", JSON.stringify(resJSON.data))
    window.location.href = "/"
    loginBtn.innerText = "Ingresar"
  } else {
    Swal.fire("Código incorrecto", "Revisa el código ingresado", "info")
    loginBtn.innerText = "Ingresar"
  }
}
