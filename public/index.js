import backendUrl from "./constants"

const submitButton = document.querySelector("button[type=submit]")
const tasksDIV = document.getElementById("tasks")
const uiContainer = document.getElementById("ui-container")

uiContainer.classList.remove("hidden")

// console.log({
//   backendUrl,
//   hostname: window.location.hostname,
//   location: window.location,
// })

submitButton.addEventListener("click", async (e) => {
  const nameInput = document.querySelector("input[name=name]")
  const taskName = nameInput.value

  const res = await fetch(`${backendUrl}/tasks`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ taskName }),
  })
  const jsonRes = await res.json()
  createAndAppendTask({ _id: jsonRes.data, name: taskName })
})

async function getTasks() {
  const res = await fetch(`${backendUrl}/tasks`)
  const jsonRes = await res.json()
  console.log({ res, jsonRes })
  renderTasks(jsonRes.data)
}

function renderTasks(tasks) {
  for (const task of tasks) {
    createAndAppendTask(task)
  }
}

function createAndAppendTask(task) {
  const taskContainerDiv = document.createElement("div")
  const taskDiv = document.createElement("div")
  taskContainerDiv.appendChild(taskDiv)
  taskContainerDiv.classList.add("task-container")
  taskDiv.classList.add("task")
  taskDiv.setAttribute("id", task._id)
  // taskDiv.addEventListener("click", handleTaskClick)
  const p = document.createElement("p")
  const trashIcon = document.createElement("icon")
  trashIcon.addEventListener("click", () => handleDeleteTask(task))
  const pencilIcon = document.createElement("icon")
  const iconsDIV = document.createElement("div")
  iconsDIV.setAttribute("id", "icons")
  p.innerText = task.name
  pencilIcon.classList.add("fas")
  pencilIcon.classList.add("fa-edit")
  trashIcon.classList.add("fas")
  trashIcon.classList.add("fa-trash")
  taskDiv.appendChild(p)
  iconsDIV.appendChild(pencilIcon)
  iconsDIV.appendChild(trashIcon)
  taskContainerDiv.appendChild(iconsDIV)

  tasksDIV.appendChild(taskContainerDiv)
}

async function handleDeleteTask(task) {
  const { isDenied } = await Swal.fire({
    title: "Atención",
    html: "¿Estás seguro que quieres eliminar esta tarea?",
    icon: "warning",
    showDenyButton: true,
    denyButtonText: "Sí, eliminar",
    showCancelButton: true,
    cancelButtonText: "No, gracias",
    showConfirmButton: false,
  })
  if (isDenied) {
    const res = await fetch(`${backendUrl}/tasks/${task._id}`, {
      method: "DELETE",
    })
    const jsonRes = await res.json()
    Swal.fire({
      title: "Listo",
      html: jsonRes.message,
      icon: "success",
      confirmButtonText: "Genial 🙃",
    })
  }
}

getTasks()
