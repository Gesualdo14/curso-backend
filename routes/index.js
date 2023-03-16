const router = require("express").Router()
const authRoutes = require("./auth")
const tasksRoutes = require("./task")
const usersRoutes = require("./user")

router.use("/auth", authRoutes)
router.use("/tasks", tasksRoutes)
router.use("/users", usersRoutes)

module.exports = router
