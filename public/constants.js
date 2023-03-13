const isDev = ["localhost", "127.0.0.1"].includes(window.location.hostname)
const backendUrl = isDev
  ? "http://localhost:4000/api"
  : "https://curso-backend.onrender.com/api"

export default backendUrl
