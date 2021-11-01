const h1 = document.querySelector('h1');
const button = document.querySelector('button');
const small = document.querySelector('small');
const span = document.querySelector('span');
const alert = document.querySelector('.alert');

const waiting = document.querySelector('#lblPendientes');

const searchParams = new URLSearchParams(window.location.search);

if( !searchParams.has('escritorio') ){
    window.location="index.html";
    throw new Error('El escritorio es obligatorio')
}

const desk = searchParams.get('escritorio');
h1.innerText = desk;

alert.style.display = 'none';


const socket = io();

socket.on('connect', () => {
    button.disabled = false;
});

socket.on('disconnect', () => {
    console.log('Desconectado del servidor');
    button.disabled = true;
});


socket.on('waiting', ( length ) => {
    waiting.innerText = length;

    if(length === 0) {
        alert.style.display = '';
    }else{
        alert.style.display = 'none';
    }
})


button.addEventListener( 'click', () => {

    socket.emit( 'attend_ticket', { desk }, ( { ok , ticket , mssg} ) => {
        if(!ok){
            small.innerHTML = `Nadie`
            span.innerHTML = mssg;
            alert.style.display ='';
            return 
        }

        small.innerHTML = `Ticket N° ${ticket.number}`

    });

});