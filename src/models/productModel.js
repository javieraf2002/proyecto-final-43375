const mongoose = require('mongoose')

const productSchema = mongoose.Schema({
    title: String,
    description: String,
    code: {
        type: String,
        unique: true
    },
    price: Number,
    status: Boolean,
    stock: Number,
    category: String,
    thumbnails: []
})

module.exports = mongoose.model('products', productSchema)