const express = require('express');
const mysql = require('mysql');
const cors = require("cors");
const { Storage } = require('@google-cloud/storage');
const qr = require('qrcode');
const { v4: uuidv4 } = require('uuid');

const app = express();
app.use(cors());


const storage = new Storage({
  keyFilename: './config/diplomski-379607-c3ea64667cfc.json',
  projectId: 'diplomski-379607',
});

const TICKETS_TABLE = "tickets";
const QR_BUCKET_NAME = "diplomski-bucket";

class Ticket {
    constructor(id, email, eventId, count, price, boughtOnDate, qrId, status='ACTIVE', usedCount='0') {
        this.id = id;
        this.email = email;
        this.eventId = eventId;
        this.count = count;
        this.price = price;
        this.boughtOnDate = boughtOnDate;
        this.qrId = qrId;
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
        this.qrId = ticket.qrId;
        this.status = ticket.status;
        this.usedCount = ticket.usedCount;
    }
}

function createTicket(data) {
    let t = new Ticket(data.id, data.email, data.eventId, data.count, data.price, data.boughtOnDate, data.qrId, data.status, data.usedCount);

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

    const uuid = uuidv4();
    ticketDTO.qrId = uuid;
    // no need to check if such ticket already exists

    const query = fillInsertTicketQuery(ticketDTO);
    const sqlOkPacket = await doQuery(query); // sqlOkPacket is a return value when inserting/updating sql table
    const insertId = sqlOkPacket.insertId;

    if (!insertId){
        return res.status(400).send("Did not insert new ticket.");
    }

    const ticket = await getTicketById(insertId)
    const qrCode = await saveQR(ticket, ticket.qrId);
    const ticketResponse = createTicketResponse(ticket);

    return res.json(ticketResponse);
})

app.get("/ticket/:id", async (req, res) => {
    const id = req.params.id;
    let ticket = await getTicketById(id);

    if (ticket === null){
        res.status(404).send("No ticket with such ID was found.");
    }

    return res.json(createTicketResponse(ticket));
})

app.get("/qr/:ticketId", async (req, res) => {
    const ticketId = req.params.ticketId;
    let ticket = await getTicketById(ticketId);

    if (ticket === null){
        res.status(404).send("No ticket with such ID was found.");
    }

    const qr = await getQR(ticket.qrId);

    return res.json({'qr':qr});
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
    const query = "INSERT INTO " + TICKETS_TABLE + " (email, eventId, count, price, boughtOnDate, qrId, status, usedCount) VALUES (" 
    + sqlStr(ticket.email) + "," 
    + sqlStr(ticket.eventId) + ","
    + sqlStr(ticket.count) + ","
    + sqlStr(ticket.price) + ","
    + sqlStr(ticket.boughtOnDate) + ","
    + sqlStr(ticket.qrId) + ","
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

async function getQR(qrId){
    const fileName = qrId + '.png';
    const bucket = storage.bucket(QR_BUCKET_NAME);
    const file = bucket.file(fileName);
    const [fileData] = await file.download();

    const stringQr = Buffer.from(fileData).toString('base64');

    return stringQr;
}


async function saveQR(ticket, uuid){
    const ticketInfo = "id: " + ticket.id; 

    qr.toDataURL(ticketInfo, async (err, qrDataURL) => {
        if (err) {
            console.error('Error generating QR code:', err);
            return;
        }

        try {
            await saveQRCodeToCloudStorage(qrDataURL, uuid);
        } catch (error) {
            console.error('Error saving QR code to cloud storage:', error);
        }
    });

    return "";
}

async function saveQRCodeToCloudStorage(qrDataURL, uuid) {
    const fileName = uuid + '.png';
    const bucket = storage.bucket(QR_BUCKET_NAME);
    const file = bucket.file(fileName);
    const fileStream = file.createWriteStream(); // Create a write stream for the file
    qr.toFileStream(fileStream, qrDataURL); // Save the QR code image to the file stream

    return new Promise((resolve, reject) => {
        fileStream.on('error', (err) => {
        console.error('Error uploading QR code image:', err);
        reject(err);
        });

        fileStream.on('finish', () => {
        console.log('QR code image saved to Google Cloud Storage');
        resolve();
        });
    });
  };

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