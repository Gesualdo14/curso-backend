const passport = require("passport")
const LocalStrategy = require("passport-local").Strategy
const JwtStrategy = require("passport-jwt").Strategy
const User = require("../models/user")
const { jwtSecretKey } = require("../utils/config")

const cookieExtractor = (req) => {
  let token = null
  if (req && req.headers.cookie) {
    token = req.headers.cookie.split("jwt=")[1]
    token = token?.includes(";") ? token.split(";")[0] : token
  }

  return token
}

// Estrategia de JWT
passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: cookieExtractor,
      secretOrKey: jwtSecretKey,
    },
    async (jwt_payload, done) => {
      // called everytime a protected URL is being served
      const user = await User.findOne({
        _id: jwt_payload.sub,
      })

      if (user) return done(null, user)

      return done(null, false)
    }
  )
)

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "code",
    },
    async function (email, code, done) {
      console.log({ email })
      try {
        const user = await User.findOne({ email, loginCode: code })
        if (!user) return done(null, false)

        return done(null, user)
      } catch (error) {
        return done(err)
      }
    }
  )
)

passport.serializeUser(function (user, done) {
  done(null, user._id)
})

passport.deserializeUser(function (id, done) {
  // Se ejecuta con cada request que llega, para ver si tiene una SESSION
  // extrae el id de la usera y la pasa

  User.findById(id, function (err, user) {
    done(err, user)
  })
})
