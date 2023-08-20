const { Router, query } = require('express')

const viewsRouterFn = (myProductManager) => {

    const viewsRouter = Router()

    viewsRouter.get('/products', async (req, res) => {

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
        res.render('products', { products })
    })

    viewsRouter.get('/product', (req, res)=>{
        return res.render('product')
    })

    viewsRouter.get('/cart', (req, res)=>{
        
        return res.render('cart')
    })

    viewsRouter.get('/error', (req, res)=>{
        
        return res.render('error')
    })

    return viewsRouter
}

module.exports = viewsRouterFn