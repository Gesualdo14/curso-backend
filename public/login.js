// const isDev = ["localhost", "127.0.0.1"].includes(window.location.hostname)
// const backendUrl = isDev
//   ? "http://localhost:4000/api"
//   : "https://curso-backend.onrender.com/api"
import backendUrl from "./constants"

const codeBtn = document.getElementById("code-btn")
const loginBtn = document.getElementById("login-btn")
const emailInput = document.getElementById("email-input")
const codeInput = document.getElementById("code-input")

loginBtn.classList.add("hidden")

codeBtn.addEventListener("click", async () => {
  const email = emailInput.value
  console.log({ email })
  const res = await fetch(`${backendUrl}/auth/code/${email}`)
  const resJSON = await res.json()
  if (resJSON.ok) {
    codeBtn.classList.add("hidden")
    loginBtn.classList.remove("hidden")
  }
  console.log({ resJSON })
})

loginBtn.addEventListener("click", async () => {
  const email = emailInput.value
  const code = codeInput.value
  console.log({ email, code })
  const res = await fetch(`${backendUrl}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" }, // necesario para que no sea BAD REQUEST
    body: JSON.stringify({ email, code }),
  })
  const resJSON = await res.json()
  if (resJSON.ok) {
    localStorage.setItem("user", resJSON.data)
    window.location.href = "/"
  }
})
