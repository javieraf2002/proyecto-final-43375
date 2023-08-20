const express = require('express')
const handlebars = require('express-handlebars')
const mongoose = require('mongoose')
const socketServer = require('../src/utils/io')
const productRouterFn = require('./routers/productsRouter')
const cartRouterFn = require('./routers/cartsRouter')
const viewsRouterFn = require('./routers/viewsRouter')

//PRODUCTOS
//const productManager = require('./managers/ProductManagerFs')
const productManager = require('./managers/ProductManagerMongo')

//CARRITO
//const cartManager = require('./managers/CartManagerFs')
const cartManager = require('./managers/CartManagerMongo')

const PORT = 8080
const URI = 'mongodb+srv://javieraf2002:W4COeZtnI3xZxlA0@cluster0.ds1mt0e.mongodb.net/eCommerce?retryWrites=true&w=majority'
const app = express()

const myProductManager = new productManager()
const myCartManager = new cartManager()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(express.static('../src/public'))

app.engine('handlebars', handlebars.engine())
app.set('views', '../src/views')
app.set('view engine', 'handlebars')

mongoose.connect(URI)
    .then(r => {
        console.log('Conexión exitosa con la base de datos 👍');
    })
    .catch(error => {
        console.log('Error de conexión' + error);
        process.exit()
    })

const httpServer = app.listen(PORT, () => { console.log(`Servidor corriendo en el puerto ${PORT} 🚀`) })
const io = socketServer(httpServer)

app.use('/api/products', productRouterFn(myProductManager))
app.use('/api/carts', cartRouterFn(myCartManager))
app.use('/', viewsRouterFn(myProductManager))