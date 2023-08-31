const passportLocal = require('passport-local')

const LocalStrategy = passportLocal.Strategy

const loginStrategy = new LocalStrategy(
    //--PARÁMETROS DE CONFIGURACIÓN
    {usernameField: 'email'},
    //FUNCIÓN
    async(username, password, done) => {
        try {
            let user = await userModel.findOne({ email: username })
            //VALIDACIÓN DEL USUARIO
            if(!user){
                console.log('El usuario no existe')
                return done(null, false)
            }
            //VALIDACIÓN DE LA CLAVE
            if (!isValidPassword(password, user.password)) {
                console.log('Clave incorrecta')
                return done(null, false)
            }
            user = user.toObject()
            delete user.password
            return done(null, user)
        } catch (error) {
            return done(error)
        }
    }
)

module.exports = loginStrategy