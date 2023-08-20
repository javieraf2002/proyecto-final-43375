const { Router } = require('express')

const cartsRouterFn = (myCartManager) => {

    const cartsRouter = Router()

    cartsRouter.get('/', async (req, res) => {

        const carts = await myCartManager.getAllCarts()
        const limit = req.query.limit
        if (!limit) {
            return res.send(carts)
        } else {
            carts.splice(limit, [...carts].length)
            return res.send(carts)
        }
    })

    cartsRouter.get('/:cid', async (req, res) => {
        try {
            //const id = parseInt(req.params.cid);
            const id = req.params.cid;
            const status = await myCartManager.getCartById(id)
            return res.status(201).json(status)
        } catch (error) {
            return res.status(404).json({
                message: error.message
            })
        }
    })

    cartsRouter.post('/', async (req, res) => {
        try {
            const status = await myCartManager.addCart()
            return res.status(201).json(status)
        } catch (error) {
            return res.status(404).json({ error: error.message })
        }
    })

    cartsRouter.post('/:cid/product/:pid', async (req, res) => {
        try {
            //const cid = parseInt(req.params.cid);
            //const pid = parseInt(req.params.pid);
            const cid = req.params.cid;
            const pid = req.params.pid;
            const status = await myCartManager.updateCart(cid, pid)
            return res.status(201).json({ status })
        } catch (error) {
            return res.status(404).json({ error: error.message })
        }
    })

    cartsRouter.delete('/:cid', async (req, res) => {
        //const id = parseInt(req.params.cid);
        const id = req.params.cid;
        try {
            await myCartManager.deleteCart(id)
            return res.status(201).json({ Status: 'Ok' })
        } catch (error) {
            
            return res.status(404).json({message: error.message})
        }
    })

    return cartsRouter
}

module.exports = cartsRouterFn