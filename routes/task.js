const router = require("express").Router()
const { get, create, update, remove } = require("../controllers/task")

router.get("/", get)
router.post("/", create)
router.put("/:id", update)
router.delete("/:id", remove)

module.exports = router
