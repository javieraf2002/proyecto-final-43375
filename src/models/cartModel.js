const mongoose = require('mongoose')

const cartSchema = mongoose.Schema({
    products: []
})

module.exports = mongoose.model('carts', cartSchema)