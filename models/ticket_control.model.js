const path = require('path');
const fs  = require('fs');
const data = require('../db/data.json');


class Ticket {

    constructor( number , desk ){
        this.number = number;
        this.desk = desk;
    }
}

class TicketControl {

    constructor(){
        this.last = 0;
        this.today = new Date().getDate();
        this.tickets = [];
        this.last_4 = [];


        this.init();
    }

    get toJson() {
        return {
            last : this.last,
            today : this.today,
            tickets : this.tickets,
            last_4 : this.last_4
        }
    }

    init(){
        const { today , last , tickets , last_4 } = data;
        //si el dia de hoy es lo mismo , cargar los datos
        if(today === this.today){
            this.tickets = tickets;
            this.last_4 = last_4,
            this.last = last;
        }else{
            //Es otro dia
            this.saveDB()
        }
    }

    saveDB(){
        const dbPath = path.join( __dirname , '../db/data.json');

        fs.writeFileSync(dbPath , JSON.stringify(this.toJson));
    }

    nexTicket(){
        this.last += 1;
        const ticket = new Ticket( this.last , null);
        this.tickets.push(ticket);

        this.saveDB();

        return `Ticket N°${ticket.number}`;
    }

    attendTicket( desk ) {

        if(this.tickets.length === 0) {
            return null;
        }

        const ticket = this.tickets.shift();//Remuevo el primero y lo extraigo
        
        ticket.desk = desk;

        this.last_4.unshift(ticket);//Añadir al inicio de los ultimos 4 -> W x y z va pasando a otro

        if(this.last_4.length >4 ){
            this.last_4.splice( -1 , 1);//Desde el ultimo
        }

        this.saveDB();
        return ticket;

    }

}

module.exports = TicketControl;