const productModel = require('../models/productModel')

class ProductsManagerMongo {
    constructor() {
        this.model = productModel
    }

    async getAllProducts() {
        const products = await this.model.find()
        return products.map(p => p.toObject())
    }

    async getAllProductsPaginate(query, params) {
        const products = await this.model.paginate(query, params)
        return products
    }

    async getProductById(pid) {
        const product = await this.model.findById(pid)
        if (!product) {
            throw new Error('El producto no existe')
        }
        return this.model.findById(pid)
    }

    async addProduct(body) {
        return await this.model.create({
            title: body.title,
            description: body.description,
            code: body.code,
            price: body.price,
            status: body.status,
            stock: body.stock,
            category: body.category,
            thumbnails: body.thumbnails,
        })
    }

    async updateProduct(pid, body) {
        const product = await this.model.findById(pid)
        if (!product) {
            throw new Error('El producto no existe')
        }
        const productUpdate = {
            title: body.title || product.title,
            description: body.description || product.description,
            code: body.code || product.code,
            price: body.price || product.price,
            status: body.status || product.status,
            stock: body.stock || product.stock,
            category: body.category || product.category,
            thumbnails: body.thumbnails || product.thumbnails,
        }
        await this.model.updateOne({ _id: pid }, productUpdate)
        return productUpdate
    }

    async deleteProduct(pid) {
        const product = await this.model.findById(pid)
        if (!product) {
            throw new Error('El producto no existe')
        }
        await this.model.deleteOne({ _id: pid })
        return true
    }
}

module.exports = ProductsManagerMongo