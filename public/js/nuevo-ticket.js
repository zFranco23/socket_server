//Referencias al dom
const newTicket = document.querySelector('#lblNuevoTicket');
const button = document.querySelector('button');




const socket = io();

socket.on('connect', () => {
    button.disabled = false;
});

socket.on('disconnect', () => {
    console.log('Desconectado del servidor');
    button.disabled = true;
});

socket.on('last_ticket' , ( last ) => {
    newTicket.innerText = `Ticket N° ${last}`;
})


button.addEventListener( 'click', () => {

    socket.emit( 'next_ticket', '', ( ticket ) => {
        newTicket.innerText = ticket;
        console.log('He creado mi ticket y es ', ticket );
    });

});