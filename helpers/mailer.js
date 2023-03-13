const nodemailer = require("nodemailer")

const transporter = nodemailer.createTransport({
  host: "outlook.office365.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: "mgesualdo@equip-arte.com", // generated ethereal user
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    // do not fail on invalid certs
    rejectUnauthorized: false,
  },
})

// En color AZUL se ven los OBJETOS
module.exports = transporter
