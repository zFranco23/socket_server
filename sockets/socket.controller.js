const TicketControl = require("../models/ticket_control.model");

const ticketControl = new TicketControl();

//Controlador de toda la comunicacion de sockets

const socketController = (socket) => {
    // console.log(socket.id)

    //Cuando recargas pierdes la conexion
    // socket.on('disconnect', () => {
    //     console.log('Cliente desconectado', socket.id);
    // })
    
    //En este punto ya se conectó 
    //Es la misma instancia de persona que se conecto , asi que si el emite y se escucha 
    //solo el lo obtendrá
    socket.emit('last_ticket' , ticketControl.last);
    socket.emit('current_state' , ticketControl.last_4);
    socket.emit('waiting',ticketControl.tickets.length );

    socket.on('next_ticket' , ( data, callback ) => {
        
        // const id =123456;
        // callback(id);
        // //Estoy emitiendo el mensaje en el mismo socket 
        // //y como tambien lo recibo en el mismo , a otros sockets no les aparecerá

        // //Mandale un mensaje a todos menos a el mismo
        // socket.broadcast.emit('enviar_data_todos', data);

        const next = ticketControl.nexTicket();

        callback(next);
        //TODO: notificar que hay nuevo ticket pendiente
        socket.broadcast.emit('waiting',ticketControl.tickets.length );
    })

    socket.on('attend_ticket', ( { desk } , callback) => {
        
        if(!desk){
            return callback({
                ok : false,
                mssg : 'Escritorio es obligatorio'
            })
        }

        const ticket = ticketControl.attendTicket(desk);
        //Emitirte a ti y a todos
        socket.emit('waiting',ticketControl.tickets.length );
        socket.broadcast.emit('waiting',ticketControl.tickets.length );
        
        socket.broadcast.emit('current_state' , ticketControl.last_4);

        if(!ticket){
            callback({
                ok :false ,
                mssg : 'Ya no hay tickets pendientes'
            })
        }else{
            callback({
                ok : true,
                ticket
            })
        }
    })
}

module.exports = socketController;