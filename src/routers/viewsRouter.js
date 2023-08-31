const { Router, query } = require('express')

const viewsRouterFn = (myProductManager) => {

    const viewsRouter = Router()

    const sessionMiddleware = (req, res, next) => {
        if (req.session.user) {
            return res.redirect('/products')
        }
        next()
    }

    const loginMiddleware = (req, res, next)=>{
        if (!req.session.user) {
            return res.redirect('/login')
        }
        next()
    }

    /******** P R O D U C T S ********/

    viewsRouter.get('/products', loginMiddleware, async (req, res) => {

        const limit = req.query.limit || 10
        const page = req.query.page || 1
        const params = { limit, page }
        let filtro = {}

        if (req.query.sort) {
            if (req.query.sort === 'desc') {
                params.sort = { price: -1 }
            } else if (req.query.sort === 'asc') {
                params.sort = { price: 1 }
            }
        }
        if (req.query.query) {
            filtro = { $or: [{ category: req.query.query }] }
        } else {
            filtro = {}
        }

        const products = await myProductManager.getAllProductsPaginate(filtro, params)
        products.docs = products.docs.map(product => product.toObject())
        const user = req.session.user
        res.render('products', { products, user })
    })

    viewsRouter.get('/product', loginMiddleware, (req, res) => {
        return res.render('product')
    })

    /******** C A R T S ********/

    viewsRouter.get('/cart', loginMiddleware, (req, res) => {

        return res.render('cart')
    })

    viewsRouter.get('/error', (req, res) => {

        return res.render('error')
    })

    /******** L O G I N ********/

    viewsRouter.get('/login', sessionMiddleware, (req, res) => {
        res.render('login')
    })

    viewsRouter.get('/register', sessionMiddleware, (req, res) => {
        res.render('register')
    })

    viewsRouter.get('/recovery-password', (req, res) => {
        res.render('recovery-password')
    })

    viewsRouter.get('/profile', (req, res, next) => {
        if (!req.session.user) {
            return res.redirect('/login')
        }
        return next()
    }, (req, res) => {
        const user = req.session.user
        res.render('profile', { user })
    })

    return viewsRouter
}

module.exports = viewsRouterFn