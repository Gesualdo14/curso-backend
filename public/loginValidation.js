import backendUrl from "./constants"

async function isUserLoggedIn() {
  const res = await fetch(`${backendUrl}/auth/verify`)

  if (!res.ok && location.pathname === "/") {
    location.href = "/login"
  }
  if (!res.ok && location.pathname === "/login") {
    const uiContainer = document.getElementById("ui-container")
    uiContainer.classList.remove("hidden")
  }
  if (res.ok && location.pathname === "/login") {
    location.href = "/"
  }
  if (res.ok && location.pathname === "/") {
    const resJSON = await res.json()
    const user = resJSON.data
    localStorage.setItem("user", JSON.stringify(user))
    const header = document.querySelector(".header")
    const userImage = document.createElement("img")
    userImage.classList.add("user-image")
    userImage.src = user.pictureUrl
    userImage.addEventListener("click", (e) => {
      const userProfileDIV = document.getElementById("user-profile")
      const userProfileBackDIV = document.getElementById(
        "user-profile-background"
      )
      userProfileDIV.classList.remove("hidden")
      userProfileBackDIV.classList.remove("hidden")
      const userImageBigger = document.createElement("img")
      userImageBigger.classList.add("user-image")
      userImageBigger.classList.add("bigger")
      userImageBigger.src = user.pictureUrl

      userProfileDIV.append(userImageBigger)

      const logoutSpan = document.createElement("span")
      logoutSpan.innerText = "Cerrar sesión"
      logoutSpan.classList.add("logout")
      logoutSpan.addEventListener("click", () => {
        localStorage.removeItem("user")
        document.cookie = "jwt=;Max-Age=0"
        document.cookie = "connect-sid=;Max-Age=0"
        location.href = "/login"
      })
      userProfileDIV.append(logoutSpan)
    })
    header.append(userImage)
    document.getElementById("ui-container").classList.remove("hidden")
  }
}

isUserLoggedIn()
