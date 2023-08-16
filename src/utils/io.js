const { Server } = require('socket.io')

const init = (httpServer, myProductManager) => {
    //VERIFICACIÓN http://localhost:8080/socket.io/socket.io.js
    const io = new Server(httpServer)

    //CADA VES QUE SE CONECTA UN CLIENTE
    io.on('connection', (socket) => {
        console.log(`Nuevo cliente conectado: ${socket.id} 👌`)
        socket.on('addProduct', async(stringData) => {
            const data = JSON.parse(stringData)
            const id = await myProductManager.addProduct(data)
            data.id = id
            io.emit('newProduct', JSON.stringify(data))    
        })
        socket.on('deleteProduct', (stringData)=>{
            myProductManager.deleteProduct(parseInt(stringData))
        })
    })
    return io
}

//EXPORTA UNA FUNCIÓN
module.exports = init