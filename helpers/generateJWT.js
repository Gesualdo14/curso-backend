const jwt = require("jsonwebtoken")
const { tokenExpiration, jwtSecretKey } = require("../utils/config")

const generateJWT = ({ user }) => {
  const token = jwt.sign(
    {
      sub: user._id,
      email: user.email,
      firstname: user?.firstname || "",
      lastname: user?.lastname || "",
      pictureUrl: user?.pictureUrl || "",
      phoneNumber: user?.whatsapp?.phoneNumber || "",
    },
    jwtSecretKey,
    { expiresIn: tokenExpiration } // Está expresado en segundos
  ) //          1min  1h   1d  1mes  6meses

  return token
}

// En color AMARILLO se ven las FUNCIONES
module.exports = generateJWT
