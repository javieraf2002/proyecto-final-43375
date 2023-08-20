const { Router } = require('express')

const productsRouterFn = (myProductManager) => {

    const productsRouter = Router()

    productsRouter.get('/', async (req, res) => {
        const products = await myProductManager.getAllProducts()
        const limit = req.query.limit
        if (!limit) {
            return res.send(products)
        } else {
            products.splice(limit, [...products].length)
            
            return res.send(products)
        }
    })

    productsRouter.get('/:pid', async (req, res) => {
        //const id = parseInt(req.params.pid);
        const id = req.params.pid;
        try {
            const status = await myProductManager.getProductById(id)
            return res.status(201).json(status)
        } catch (error) {
            return res.status(404).json({
                message: error.message
            })
        }
    })

    productsRouter.post('/', async (req, res) => {
        const product = req.body
        try {
            const status = await myProductManager.addProduct(product)
            return res.status(201).json(status)
        } catch (error) {
            return res.status(404).json({
                message: error.message
            })
        }
    })

    productsRouter.delete('/:pid', async (req, res) => {
        //const id = parseInt(req.params.pid);
        const id = req.params.pid;
        try {
            await myProductManager.deleteProduct(id)
            return res.status(201).json({ Status: 'Ok' })
        } catch (error) {
            return res.status(404).json({
                message: error.message
            })
        }
    })

    productsRouter.put('/:pid', async (req, res) => {
        try {
            const data = req.body
            //const id = parseInt(req.params.pid);
            const id = req.params.pid;
            const status = await myProductManager.updateProduct(id, data) || 'OK'
            return res.status(201).json({ status })
        } catch (error) {
            return res.status(404).json({
                message: error.message
            })
        }
    })

    return productsRouter
}

module.exports = productsRouterFn