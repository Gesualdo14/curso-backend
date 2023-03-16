const router = require("express").Router()
const filesMid = require("../middlewares/files")
const { attach } = require("../controllers/user")

router.post("/:id/attach", filesMid, attach)

module.exports = router
