const { Router, json } = require('express')
const userModel = require('../models/userModel')

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
    if (!user) {
        return res.status(401).json({ error: 'El usuario no existe en el sistema' })
    }
    if (user.password !== req.body.password) {
        return res.status(401).json({ error: 'Contraseña incorrecta' })
    }
    user = user.toObject() //PASAR DE UN OBJETO MONGO A UNA JAVASCRIPT
    delete user.password
    req.session.user = user
    return res.redirect('/products')
    //return res.json(user) //PARA UN API
})

sessionRouter.post('/register', async (req, res) => {
    try {
        const user = await userModel.create(req.body)
        return res.redirect('/login')
    } catch (error) {
        return res.status(500).json({ error: error })
    }
})

sessionRouter.get('/logout', (req, res) => {
    req.session.destroy(error => {
        if (!error) {
            return res.redirect('/login')
        }
        return res.status(500).json({ error: error })
    })
})

module.exports = sessionRouter