const passportLocal = require('passport-local')

const LocalStrategy = passportLocal.Strategy

const registerStrategy = new LocalStrategy(
    //--PARÁMETROS DE CONFIGURACIÓN
    { passReqToCallback: true, usernameField: 'email' },
    //--FUNCIÓN
    async (req, username, password, done) => {
        //ESTO ES LO QUE SE HACIA EN EL SESSION ROUTER
        try {
            //RECUPERO EL USUARIO DE MONGOOSE
            const user = await userModel.findOne({ email: username })
            if (user) {
                console.log('Usuario ya Existe')
                return done(null, false)
            }
            //SI NO EXISTE LO AGREGO
            const body = req.body
            body.password = createHash(body.password)
            const newUser = await userModel.create(body)
            return done(null, newUser)
        } catch (error) {
            return done(error)
        }
    }
)

module.exports = registerStrategy