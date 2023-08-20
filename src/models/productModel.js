const mongoose = require('mongoose')
const mongoosePaginate = require('mongoose-paginate-v2')

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

productSchema.plugin(mongoosePaginate)


module.exports = mongoose.model('products', productSchema)