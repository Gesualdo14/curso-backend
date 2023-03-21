const router = require("express").Router()
const passport = require("passport")
const { get, create, update, remove } = require("../controllers/task")

router.use("/", passport.authenticate("jwt"))

router.get("/", get)
router.post("/", create)
router.put("/:id", update)
router.delete("/:id", remove)

module.exports = router
