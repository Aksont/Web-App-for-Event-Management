const express = require('express');
const mysql = require('mysql');
const cors = require("cors");

const app = express();
app.use(cors());

const TICKETS_TABLE = "tickets";

class Ticket {
    constructor(id, email, eventId, count, price, boughtOnDate, status='ACTIVE', usedCount='0') {
        this.id = id;
        this.email = email;
        this.eventId = eventId;
        this.count = count;
        this.price = price;
        this.boughtOnDate = boughtOnDate;
        this.status = status;
        this.usedCount = usedCount;
    }
}

class TicketDTO {
    constructor(email, eventId, count, price) {
        this.email = email;
        this.eventId = eventId;
        this.count = count;
        this.price = price;
    }
}

class TicketResponse {
    constructor(ticket) {
        this.id = ticket.id;
        this.email = ticket.email;
        this.eventId = ticket.eventId;
        this.count = ticket.count;
        this.price = ticket.price;
        this.boughtOnDate = ticket.boughtOnDate;
        this.status = ticket.status;
        this.usedCount = ticket.usedCount;
    }
}

function createTicket(data) {
    let t = new Ticket(data.id, data.email, data.eventId, data.count, data.price, data.boughtOnDate, data.status, data.usedCount);

    return t;
}

function createTicketDTO(data) {
    let t = new TicketDTO(data.email, data.eventId, data.count, data.price);

    return t;
}

function createTicketResponse(ticket) {
    let t = new TicketResponse(ticket);

    return t;
}

app.get('/', (req, res) => {
    let message = req.query.message || "ticket-service";

    res.status(200).send(message);
})

app.get('/hello', (req, res) => {
    res.status(200).send("ticket-service");
})

app.post("/buy-ticket", async (req, res) => {
    let ticketDTO = createTicketDTO(req.body);
    ticketDTO.boughtOnDate = getTodayDate();
    // no need to check if such ticket already exists

    const query = fillInsertTicketQuery(ticketDTO);
    const sqlOkPacket = await doQuery(query); // sqlOkPacket is a return value when inserting/updating sql table
    const insertId = sqlOkPacket.insertId;

    if (!insertId){
        return res.status(400).send("Did not insert new ticket.");
    }

    const ticket = await getTicketById(insertId)
    const ticketResponse = createTicketResponse(ticket);

    return res.json(ticketResponse);
})

app.get("/ticket/:id", async (req, res) => {
    const id = req.params.id;
    let ticket = await getTicketById(id);

    if (ticket === null){
        res.status(404).send("No ticket with such ID was found.");
    }

    res.json(createTicketResponse(ticket));
})

app.get("/tickets/:email", async (req, res) => {
    const email = req.params.email;
    console.log(email)
    const tickets = await getTicketsForUser(email);
    let ticketResponses = []

    for (let t of tickets){
        const ticketResponse = createTicketResponse(t);
        ticketResponses.push(ticketResponse);
    }

    return res.json(ticketResponses);
})

app.get("/visited-events/:email", async (req, res) => {
    // TODO
    // 
    // should request from event-service if the event is completed
})

app.get("/active-tickets/:email", async (req, res) => {
    // TODO
    // 
    // should request from event-service if the event is completed
})

async function getTicketsForUser(email){
    const query = "SELECT * FROM " + TICKETS_TABLE + " WHERE email = " + sqlStr(email);
    
    let results = await doQuery(query);

    return results;
}

async function getTicketById(id){
    const query = "SELECT * FROM " + TICKETS_TABLE + " WHERE id = " + id;
    
    return await getTicket(query);
}

async function getTicket(query){
    let results = await doQuery(query);

    if (results.length === 0){
        return null;
    } else {
        return createTicket(results[0]);
    }
}

function fillInsertTicketQuery(ticket) {
    const query = "INSERT INTO " + TICKETS_TABLE + " (email, eventId, count, price, boughtOnDate, status, usedCount) VALUES (" 
    + sqlStr(ticket.email) + "," 
    + sqlStr(ticket.eventId) + ","
    + sqlStr(ticket.count) + ","
    + sqlStr(ticket.price) + ","
    + sqlStr(ticket.boughtOnDate) + ","
    + sqlStr("ACTIVE") + ","
    + sqlStr("0") + 
    ")";

    return query;
}

function getTodayDate(){
    let date_ob = new Date();
    // adjust 0 before single digit date
    let date = ("0" + date_ob.getDate()).slice(-2);
    let month = ("0" + (date_ob.getMonth() + 1)).slice(-2);
    let year = date_ob.getFullYear();

    // date in YYYY-MM-DD format
    let todaysDate = year + "-" + month + "-" + date;

    return todaysDate;
}

// vvv every function uses: vvv

function sqlStr(word){
    return "'" + word + "'";
}

function doQuery (query) {
    return new Promise((resolve, reject)=>{
        pool.query(query, (error, results) => {
            if (error){
                // console.log(error);
                return reject(error);
            } else {
                // console.log(results)
                if (results){
                    return resolve(results);
                }
            }
        });
    });
}

const pool = mysql.createPool({
    user: "root", // process.env.DB_USER
    password: "diplomski", // process.env.DB_PASS
    database: "eventerDB", // process.env.DB_NAME
    // socketPath: "/cloudsql/diplomski-379607:us-central1:diplomski", // process.env.INSTANCE_CONNECTION_NAME
    host: "35.184.63.121"  
});

exports.appfunc = app;

// ^^^ every function uses ^^^