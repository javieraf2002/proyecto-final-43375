const passport = require('passport')
const githubStrategy = require('../strategies/githubStrategy')
const loginLocalStrategy = require('../strategies/loginLocalStrategy')
const registerLocalStrategy = require('../strategies/registerLocalStrategy')

const userModel = require('../models/userModel')

const initializePassport = () => {
    passport.use('github', githubStrategy)
    passport.use('login', loginLocalStrategy)
    passport.use('register', registerLocalStrategy)

    passport.serializeUser((user, done) => {
        console.log('serializeUser');
        done(null, user._id)
    })

    passport.deserializeUser(async (id, done) => {
        console.log('deserializeUser');
        const user = await userModel.findOne({ _id: id })
        done(null, user)
    })
}

module.exports = initializePassport