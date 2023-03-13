const router = require("express").Router()
const authRoutes = require("./auth")
const tasksRoutes = require("./task")

router.use("/auth", authRoutes)
router.use("/tasks", tasksRoutes)

module.exports = router
