const passport = require("passport")
const { getCode, login, verifyUser } = require("../controllers/auth")

const router = require("express").Router()

router.get("/code/:email", getCode)
router.post("/login", passport.authenticate("local", { session: true }), login)
router.post("/verify", passport.authenticate("jwt"), verifyUser)

module.exports = router
