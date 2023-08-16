const cartModel = require('../models/cartModel')

class CartsManagerMongo {
    constructor() {
        this.model = cartModel
    }

    async getAllCarts() {
        const carts = await this.model.find()
        return carts.map(c => c.toObject())
    }

    async getCartById(cid) {
        const cart = await this.model.findById(cid)
        if (!cart) {
            throw new Error('El carrito no existe')
        }
        return await this.model.findById(cid)
    }

    async addCart() {
        return await this.model.create({
            products: []
        })
    }

    async updateCart(cid, pid) {
        const cart = await this.model.findById(cid)
        if (cart) {
            const products = cart.products
            let product = products.find(p => p.id === pid)
            if (product === undefined) {
                product = {
                    id: pid,
                    quantity: 1
                }
                products.push(product)
            } else {
                product.quantity = product.quantity + 1
            }
            await this.model.updateOne({_id : cid}, {products})
            return products
        } else {
            throw new Error('El carrito no existe')
        }
    }

    async deleteCart(cid) {
        const cart = await this.model.findById(cid)
        if (!cart) {
            throw new Error('El carrito no existe')
        }
        await this.model.deleteOne({ _id: cid })
        return true
    }
}

module.exports = CartsManagerMongo