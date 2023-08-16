const fs = require('fs')

class ProductManagerFs {
    constructor() {
        this.path = './data/productos.json'
        this.iniciar()
    }

    iniciar() {
        if (!fs.existsSync(this.path)) {
            const contenido = []
            fs.writeFileSync(this.path, JSON.stringify(contenido))
        }
    }

    async getAllProducts() {
        return fs.promises.readFile(this.path, 'utf-8')
            .then((productsString) => {
                const products = JSON.parse(productsString)
                return products
            })
            .catch((error) => {
                return []
            })
    }

    async getProductById(id) {
        return this.getAllProducts()
            .then((products) => {
                const product = products.find(product => product.id === id)
                if (product) {
                    return product
                } else {
                    throw new Error('No existe')
                }
            })
    }

    async addProduct(data) {
        if (!data.title
            || !data.description
            || !data.code
            || !data.price
            || !data.status
            || !data.stock
            || !data.category) {
            throw new Error('Campos incorrectos')
        }
        const product = {
            title: data.title,
            description: data.description,
            code: data.code,
            price: data.price,
            status: data.status,
            stock: data.stock,
            category: data.category,
            thumbnails: data.thumbnails,
        }
        return this.getAllProducts()
            .then((products) => {
                product.id = products.length + 1
                products.push(product)
                fs.promises.writeFile(this.path, JSON.stringify(products, null, 2))
                return product
            })
    }

    async deleteProduct(id) {
        return this.getAllProducts()
            .then((products) => {
                const productIndex = products.findIndex(product => product.id === id)
                if (productIndex !== -1) {
                    products.splice(productIndex, 1)
                    return fs.promises.writeFile(this.path, JSON.stringify(products, null, 2))
                } else {
                    throw new Error('No existe')
                }
            })
    }

    async updateProduct(id, data) {
        if (!data.title
            || !data.description
            || !data.code
            || !data.price
            || !data.status
            || !data.stock
            || !data.category) {
            throw new Error('Campos incorrectos')
        }
        return this.getAllProducts()
            .then((products) => {
                const productIndex = products.findIndex(product => product.id === id)
                if (productIndex !== -1) {
                    products[productIndex].title = data.title
                    products[productIndex].description = data.description
                    products[productIndex].code = data.code
                    products[productIndex].price = data.price
                    products[productIndex].status = data.status
                    products[productIndex].stock = data.stock
                    products[productIndex].category = data.category
                    products[productIndex].thumbnail = data.thumbnail
                    fs.promises.writeFile(this.path, JSON.stringify(products, null, 2))
                    return products[productIndex]
                } else {
                    throw new Error('No existe')
                }
            })
    }
}

module.exports = ProductManagerFs