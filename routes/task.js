const router = require("express").Router()
const { get, create, remove } = require("../controllers/task")

router.get("/", get)
router.post("/", create)
router.delete("/:id", remove)

module.exports = router
