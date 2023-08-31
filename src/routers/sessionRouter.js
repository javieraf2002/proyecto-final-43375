const { Router, json } = require('express')
const userModel = require('../models/userModel')
const { createHash, isValidPassword } = require('../utils/passwordHash')
const passport = require('passport')

const sessionRouter = Router()

sessionRouter.get('/', (req, res) => {
    if (!req.session.counter) {
        req.session.counter = 1
        req.session.name = req.query.name
        return res.json(`Bienvenido ${req.session.name}`)
    } else {
        req.session.counter++
        return res.json(`${req.session.name}, has visitado la pagina ${req.session.counter} veces`)
    }
})

sessionRouter.post('/login', async (req, res) => {
    let user = await userModel.findOne({ email: req.body.email })
    console.log(user)
    if (!user) {
        return res.status(401).json({ error: 'El usuario no existe en el sistema' })
    }
    if (!isValidPassword(req.body.password, user.password)) {
        return res.status(401).json({ error: 'Contraseña incorrecta' })
    }
    user = user.toObject() //PASAR DE UN OBJETO MONGO A UNA JAVASCRIPT
    delete user.password
    req.session.user = user
    /*     if(req.query.client ==='api'){
            return res.json(user)
        }
     */
    console.log('ok');
    return res.redirect('/products')
})

sessionRouter.post('/register', async (req, res) => {
    try {
        const body = req.body
        body.password = createHash(body.password)
        const user = await userModel.create(body)
        if (req.query.client === 'api') {
            return res.status(201).json(user)
        }
        return res.redirect('/login')
    } catch (error) {
        return res.status(500).json({ error: error.message })
    }
})

sessionRouter.get('/logout', (req, res) => {
    req.session.destroy(error => {
        if (!error) {
            return res.redirect('/login')
        }
        return res.status(500).json({ error: error.message })
    })
})

sessionRouter.post('/recovery-password', async (req, res) => {
    let user = await userModel.findOne({ email: req.body.email })
    if (!user) {
        return res.status(401).json({ error: 'El usuario no existe en el sistema' })
    }
    const newPassword = createHash(req.body.password)
    await userModel.updateOne({ email: user.email }, { password: newPassword })
    return res.redirect('/login')
})

sessionRouter.get('/github', passport.authenticate('github', { scope: ['user:email'] }), (req, res) => {

})

sessionRouter.get('/github-callback', passport.authenticate('github', { failureRedirect: '/login' }), async(req, res) => {
    return res.redirect('/profile')
})

module.exports = sessionRouter