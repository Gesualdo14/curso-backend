const User = require("../models/user")
const mailer = require("../helpers/mailer")
const generateJWT = require("../helpers/generateJWT")
const { areWeInProduction } = require("../utils/config")

const getCode = async (req, res) => {
  const { email } = req.params

  const isValidEmail =
    /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
      email
    )

  const emailLower = email.toLowerCase()

  if (!isValidEmail) {
    res.status(400).json({ ok: false })
    return
  }

  const numbers = "0123456789"
  let randomCode = ""

  Array(6)
    .fill()
    .map(() => {
      const numberIndex = Math.round(Math.random() * 9, 0)
      randomCode = randomCode + numbers[numberIndex]
    })

  const foundUser = await User.findOne({ email: emailLower })

  if (!foundUser) {
    await User.create({ email: emailLower, loginCode: randomCode })
  } else {
    await User.findByIdAndUpdate(foundUser._id, { loginCode: randomCode })
  }

  mailer
    .sendMail({
      from: "mgesualdo@equip-arte.com", // sender address
      to: emailLower, // list of receivers
      subject: "Código de ingreso", // Subject line
      html: `
        <p>Tu código de ingreso es: <b>${randomCode}</b></p>
        `, // html body
    })
    .then(() => {
      res.status(200).json({
        ok: true,
        message: "Código enviado con éxito ✅",
      })
    })
    .catch((err) => {
      console.log({ err })
      res.status(400).json({
        ok: true,
        message: "Error al enviar el código ❌",
        data: err,
      })
    })
}

const login = async (req, res) => {
  // If this function gets called, authentication was successful.
  // `req.user` contains the authenticated user.
  console.log("LOCAL CALLBACK!")
  const user = req.user

  let token = generateJWT({ user })

  res.cookie("jwt", token, {
    secure: areWeInProduction,
    sameSite: areWeInProduction ? "None" : "strict",
  })

  res.status(200).json({
    ok: true,
    data: { _id: user._id, email: user.email },
    redirect: "/",
  })
}

const verifyUser = (req, res) => {
  res.status(200).json({ ok: true, data: req.user })
}

module.exports = { getCode, login, verifyUser }
