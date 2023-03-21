import backendUrl from "./constants"

const submitButton = document.querySelector("button[type=submit]")
const tasksDIV = document.getElementById("tasks")
const uiContainer = document.getElementById("ui-container")
const nameInput = document.querySelector("input[name=name]")

uiContainer.classList.remove("hidden")

let TASK_TO_EDIT = null

// console.log({
//   backendUrl,
//   hostname: window.location.hostname,
//   location: window.location,
// })

submitButton.addEventListener("click", async (e) => {
  e.preventDefault()
  const taskName = nameInput.value

  if (!taskName) {
    return Swal.fire("UPS", "Debes indicar la denominación de la tarea", "info")
  }

  if (taskName.length < 5) {
    return Swal.fire(
      "UPS",
      "La denominación de la tarea debe tener al menos 5 caracteres",
      "info"
    )
  }
  try {
    submitButton.innerText = TASK_TO_EDIT ? "Editando..." : "Creando..."
    const path = TASK_TO_EDIT ? `tasks/${TASK_TO_EDIT._id}` : "tasks"
    const res = await fetch(`${backendUrl}/${path}`, {
      method: TASK_TO_EDIT ? "PUT" : "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ taskName }),
    })
    submitButton.innerText = "Crear tarea"
    TASK_TO_EDIT = null
    const jsonRes = await res.json()
    if (jsonRes.ok) {
      createAndAppendTask({
        _id: jsonRes.data,
        name: taskName,
      })
    } else {
      Swal.fire(jsonRes.swalConfig)
    }
  } catch (error) {
    console.log({ error })
    Swal.fire(
      "UPS",
      "Hubo un error al crear la tarea, intente más tarde",
      "error"
    )
  }
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
  const existingTask = document.querySelector(`div[id='${task._id}'] div p`)
  if (!!existingTask) {
    existingTask.innerText = task.name
  } else {
    const taskContainerDiv = document.createElement("div")
    const taskDiv = document.createElement("div")
    taskContainerDiv.appendChild(taskDiv)
    taskContainerDiv.setAttribute("id", task._id)
    taskContainerDiv.classList.add("task-container")
    taskDiv.classList.add("task")
    const p = document.createElement("p")
    p.classList.add("p-task")
    const trashIcon = document.createElement("i")
    trashIcon.addEventListener("click", () => handleDeleteTask(task))
    const pencilIcon = document.createElement("i")
    pencilIcon.addEventListener("click", () => handleEditTask(task))
    const inputCheck = document.createElement("input")
    inputCheck.setAttribute("type", "checkbox")
    inputCheck.addEventListener("click", () => handleDoneTask(task, taskDiv))
    inputCheck.addEventListener("change", () => console.log("change"))
    inputCheck.setAttribute("id", task._id)
    if (task.completed) {
      inputCheck.checked = task.completed
      taskDiv.classList.add("completed")
    }
    // inputCheck.checked = task.completed
    const iconsDIV = document.createElement("div")
    iconsDIV.setAttribute("id", "icons")
    p.innerText = task.name
    pencilIcon.classList.add("fas")
    pencilIcon.classList.add("fa-edit")
    trashIcon.classList.add("fas")
    trashIcon.classList.add("fa-trash")
    taskDiv.appendChild(p)
    iconsDIV.appendChild(inputCheck)
    iconsDIV.appendChild(pencilIcon)
    iconsDIV.appendChild(trashIcon)
    taskContainerDiv.appendChild(iconsDIV)

    tasksDIV.appendChild(taskContainerDiv)
  }
  nameInput.value = ""
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
    document.getElementById(task._id).remove()
  }
}

async function handleDoneTask(task, taskDiv) {
  const existingCheck = document.querySelector(`input[id='${task._id}']`)
  taskDiv.classList.toggle("completed")
  console.log({ existingCheck })
  const res = await fetch(`${backendUrl}/tasks/${task._id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ completed: existingCheck.checked }),
  })
  if (!res.ok) {
    taskDiv.classList.toggle("completed")
    Swal.fire(
      "UPS",
      "Hubo un problema al cambiar el estado de la tarea",
      "warning"
    )
  }
}

async function handleEditTask(task) {
  const taskParagraph = document.querySelector(`div[id='${task._id}'] div p`)
  submitButton.innerText = "Editar tarea"
  // nameInput.value = task.name
  nameInput.value = taskParagraph.innerText
  TASK_TO_EDIT = task
}

getTasks()
