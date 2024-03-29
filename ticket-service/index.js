const express = require('express');
const mysql = require('mysql');
const cors = require("cors");
const { Storage } = require('@google-cloud/storage');
const qr = require('qrcode');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');

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

class ReportDTO {
    constructor(data) {
        this.reportType = data.reportType;
        this.fromDate = data.fromDate;
        this.toDate = data.toDate;
        this.eventIds = data.eventIds; // list
    }
}

app.post("/buy-ticket", verifyToken, async (req, res) => {
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

app.get("/ticket/:id", verifyToken, async (req, res) => {
    const id = req.params.id;
    let ticket = await getTicketById(id);

    if (ticket === null){
        res.status(404).send("No ticket with such ID was found.");
    }

    return res.json(createTicketResponse(ticket));
})

app.get("/qr/:ticketId", verifyToken, async (req, res) => {
    const ticketId = req.params.ticketId;
    let ticket = await getTicketById(ticketId);

    if (ticket === null){
        res.status(404).send("No ticket with such ID was found.");
    }

    const qr = await getQR(ticket.qrId);

    return res.json({'qr':qr});
})

app.get("/tickets/:email", verifyToken, async (req, res) => {
    const email = req.params.email;
    const ticketResults = await getTicketsForUser(email);
    const ticketResponses = getTicketsResponseFromResults(ticketResults);

    return res.json(ticketResponses);
})

app.post("/report", verifyToken, async (req, res) => {
    let reportDTO = new ReportDTO(req.body);

    if (!!reportDTO.fromDate && !!reportDTO.toDate && reportDTO.fromDate >= reportDTO.toDate){
        res.status(409).send("Invalid date combination.");
    } else if (!reportDTO.eventIds || reportDTO.eventIds.length === 0){
        res.status(409).send("No event ids provided.");
    }

    reportDTO = await determineFromAndToDates(reportDTO);
    let periods;

    if (reportDTO.reportType === 'YEAR') {
        periods = getReportYears(reportDTO);
    } else if (reportDTO.reportType === 'MONTH') {
        periods = getReportMonths(reportDTO);
    } else {
        return res.status(409).send("Invalid report type.");
    }

    const report = await getReportForPeriods(reportDTO, periods);

    console.log(report)

    return res.json(report);
})

async function determineFromAndToDates(reportDTO){
    if (!reportDTO.fromDate || !reportDTO.toDate){
        const [earliestDate, latestDate] = await findEarliestAndLatestDate(reportDTO.eventIds);

        if (!reportDTO.fromDate) {
            reportDTO['fromDate'] = earliestDate;
        }

        if (!reportDTO.toDate) {
            reportDTO['toDate'] = latestDate;
        }
    }

    return reportDTO;
}

async function findEarliestAndLatestDate(eventIds){
    const query = "SELECT * FROM " + TICKETS_TABLE + " WHERE eventId IN " + getIdsAsSqlString(eventIds) + "ORDER BY boughtOnDate ASC";
    const results = await doQuery(query);
    
    if (results.length > 0){
        const first = createTicketResponse(results[0]).boughtOnDate;
        const last = createTicketResponse(results[results.length - 1]).boughtOnDate;

        return [first, last];
    }

    return [null, null]
}

function getReportYears(reportDTO){
    let years = [];
    const fromYear = Number(reportDTO.fromDate.split("-")[0]);
    const toYear = Number(reportDTO.toDate.split("-")[0]);
    let iYear = fromYear;

    while (iYear <= toYear){
        years.push(iYear);
        iYear++;
    }

    return years;
}

function getReportMonths(reportDTO){
    let months = [];
    const fromYear = Number(reportDTO.fromDate.split("-")[0]);
    const fromMonth = Number(reportDTO.fromDate.split("-")[1]);
    const toYear = Number(reportDTO.toDate.split("-")[0]);
    const toMonth = Number(reportDTO.toDate.split("-")[1]);
    const finalPeriod = formatMonthPeriod(toYear, toMonth);
    let iYear = fromYear;
    let iMonth = fromMonth;
    let iPeriod;

    while (formatMonthPeriod(iYear, iMonth) <= finalPeriod){
        iPeriod = formatMonthPeriod(iYear, iMonth);
        months.push(iPeriod);
        iMonth++;

        if (iMonth === 13){
            iMonth = 0;
            iYear++;
        }
    }

    return months;
}

function formatMonthPeriod(year, month){
    let iPeriod = year + "-";
    
    if (month < 10){
        iPeriod += "0";
    } 

    iPeriod += month;

    return iPeriod;
}

async function getReportForPeriods(reportDTO, periods){
    console.log(periods)
    let report = [];

    for (let period of periods){
        const query = getReportPeriodQuery(reportDTO, period);
        const results = await doQuery(query);
        const tickets = getTicketsResponseFromResults(results);
        const numOfTickets = tickets.length;
        const income = tickets.reduce((sum, ticket) => sum + ticket.price, 0);

        report.push({'period' : period.toString(), "numOfTickets": numOfTickets, "income": income});
    }

    return report;
}

function getReportPeriodQuery(reportDTO, period){
    let query = "SELECT * FROM " + TICKETS_TABLE + " WHERE eventId IN " + getIdsAsSqlString(reportDTO.eventIds) + " AND boughtOnDate LIKE " + sqlStr(period + "%")
                + " AND boughtOnDate >= " + sqlStr(reportDTO.fromDate)
                + " AND boughtOnDate <= " + sqlStr(reportDTO.toDate); 
    
    return query;
}

function getIdsAsSqlString(eventIds){
    let idsString = "(";

    for (let i in eventIds){
        idsString += eventIds[i];
        idsString += (i < eventIds.length - 1) ? "," : ")";
    }

    return idsString;
}

function getTicketsResponseFromResults(results){
    let ticketResponses = []

    for (let r of results){
        const ticketResponse = createTicketResponse(r);
        ticketResponses.push(ticketResponse);
    }

    return ticketResponses;
}

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

// vvv JWT vvv

const secretKey = 'Kw7bA3v9eN1TcXt6RiY5zSx8Fm2VgPq0LjH4uGn1My5Bp6Da3Cv9Kx7Zo2Ir5Fp0T';

function verifyToken(req, res, next) {
    const token = req.headers.authorization?.split(' ')[1]; 
  
    if (!token) {
      return res.status(401).send("No token");
    }
  
    jwt.verify(token, secretKey, (err, decoded) => {
      if (err) {
        return res.status(401).send("Invalid token");
      }
  
      req.user = decoded;
      next(); 
    });
  }

// ^^^ JWT ^^^

exports.appfunc = app;

// ^^^ every function uses ^^^