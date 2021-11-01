const express = require('express');
const socket = require('socket.io');
const http = require('http');
const cors = require('cors');

const socketController = require('../sockets/socket.controller');

class Server {

    constructor() {
        this.app  = express();
        this.port = process.env.PORT;
        //Configuracion para el socket
        this.server = http.createServer(this.app);
        //El io es toda la información de los sockets conectados
        this.io = socket(this.server); 

        this.paths = {}


        // Middlewares
        this.middlewares();

        // Rutas de mi aplicación
        this.routes();

        //Sockets
        this.sockets();
    }

    middlewares() {

        // CORS
        this.app.use( cors() );

        // Directorio Público
        this.app.use( express.static('public') );

    }

    sockets() {
        //this.io hace referencia a nuestro servidor de sockets
        this.io.on("connection" , socketController)
    }

    routes(){

    }

    listen() {
        this.server.listen( this.port, () => {
            console.log('Servidor corriendo en puerto', this.port );
        });
    }

}




module.exports = Server;