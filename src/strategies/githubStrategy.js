const GitHubStrategy = require('passport-github2')
const userModel = require('../models/userModel')

const githubStrategy = new GitHubStrategy(
    {
        clientID: 'Iv1.b68b3de4c0e3f7de',
        clientSecret: '0168556e43346b5466d0c4a9cdaec32435dc2f83',
        callbackURL: 'http://localhost:8080/api/session/github-callback'
    },
    async (accessToken, refreshToken, profile, done) => {
        console.log(profile);
        try {
            //RECUPERO EL USUARIO DE MONGOOSE
            const user = await userModel.findOne({ username: profile._json.login })
            if (user) {
                console.log('Usuario ya Existe')
                return done(null, user)
            }
            //SI NO EXISTE LO AGREGO
            const newUser = await userModel.create({
                username: profile._json.login,
                name: profile._json.name
            })
            return done(null, newUser)
        } catch (error) {
            return done(error)
        }
    })

module.exports = githubStrategy