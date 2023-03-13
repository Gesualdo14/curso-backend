const router = require("express").Router()
const filesMid = require("../middlewares/files")
const { get, create, attach, remove } = require("../controllers/task")

router.get("/", get)
router.post("/", create)
router.post("/:id/attach", filesMid, attach)
router.delete("/:id", remove)

module.exports = router
