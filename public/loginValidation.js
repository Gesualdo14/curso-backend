function isUserLoggedIn() {
  const user = localStorage.getItem("user")
  console.log({ location })
  if (!user && location.pathname === "/") {
    location.href = "/login"
  } else {
    document.getElementById("ui-container").classList.remove("hidden")
  }
}

isUserLoggedIn()
