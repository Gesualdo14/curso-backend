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
    const imageInput = document.querySelector("input#user-image")
    imageInput.addEventListener("change", async (e) => {
      const file = e.target.files[0]
      const formData = new FormData()
      const now = Date.now()
      formData.append("file", file, file.name)
      formData.append("now", now)

      try {
        const response = await fetch(`${backendUrl}/users/${user._id}/attach`, {
          method: "POST",
          body: formData,
        })
        const userImage = document.querySelector("img#user-image")
        const userImageBigger = document.querySelector(".user-image.bigger")
        userImage.setAttribute(
          "src",
          `${userImage.getAttribute("src")}?now=${now}`
        )
        userImageBigger.setAttribute(
          "src",
          `${userImageBigger.getAttribute("src")}?now=${now}`
        )
      } catch (error) {
        console.error(error)
      }
    })
    localStorage.setItem("user", JSON.stringify(user))
    const header = document.querySelector(".header")
    const userImage = document.createElement("img")
    userImage.classList.add("user-image")
    userImage.setAttribute("id", "user-image")
    userImage.src = user.pictureUrl
    userImage.addEventListener("click", (e) => {
      const userProfileDIV = document.getElementById("user-profile")
      const userProfileBackDIV = document.getElementById(
        "user-profile-background"
      )
      userProfileBackDIV.addEventListener("click", (e) => {
        e.preventDefault()
        userProfileBackDIV.classList.add("hidden")
        userProfileDIV.classList.add("hidden")
      })
      userProfileDIV.classList.remove("hidden")
      userProfileBackDIV.classList.remove("hidden")
      let userImageBigger = document.querySelector(".user-image.bigger")

      if (!userImageBigger) {
        userImageBigger = document.createElement("img")
        userImageBigger.classList.add("user-image")
        userImageBigger.classList.add("bigger")
        userImageBigger.src = user.pictureUrl
        userImageBigger.addEventListener("click", () => {
          imageInput.click()
          const clipIcon = document.createElement("icon")
          clipIcon.addEventListener("click", () => handleAttach(task))
          clipIcon.classList.add("fas")
          clipIcon.classList.add("fa-paperclip")
        })
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
      }
    })
    header.append(userImage)
    document.getElementById("ui-container").classList.remove("hidden")
  }
}

isUserLoggedIn()
