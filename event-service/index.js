const express = require('express');
const mysql = require('mysql');
const app = express();

const EVENTS_TABLE = "events";
const EVENTS_DESC_TABLE = "events_desc";

class Event {
    constructor(id, name, address, eventType, startDate, endDate, startTime, endTime, dateCreated, status='ACTIVE') {
        this.id = id;
        this.name = name;
        this.address = address;
        this.eventType = eventType;
        this.startDate = startDate;
        this.endDate = endDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.dateCreated = dateCreated;
        this.status = status;
    }
}

class EventDTO {
    constructor(name, address, eventType, startDate, endDate, startTime, endTime, dateCreated) {
        this.name = name;
        this.address = address;
        this.eventType = eventType;
        this.startDate = startDate;
        this.endDate = endDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.dateCreated = dateCreated;
    }
}

class EventResponse {
    constructor(name, address, eventType, startDate, endDate, startTime, endTime, dateCreated, status) {
        this.name = name;
        this.address = address;
        this.eventType = eventType;
        this.startDate = startDate;
        this.endDate = endDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.dateCreated = dateCreated;
        this.status = status;
        this.mainOrganizator = null;  //TODO
        this.organizers = []; //TODO
        this.performers = []; //TODO
    }
}

function createEvent(data) {
    let e = new Event(data.id, data.name, data.address, data.eventType, data.startDate, data.endDate, data.startTime, data.endTime, data.dateCreated, data.status);

    return e;
}

function createNewEvent(data) {
    let e = new Event(data.id, data.name, data.address, data.eventType, data.startDate, data.endDate, data.startTime, data.endTime, data.dateCreated);

    return e;
}

function createEventDTO(data) {
    let u = new EventDTO(data.name, data.lastname, data.userType, data.email, data.password);

    return u;
}

function createEventResponse(event) {
    let u = new EventResponse(event.name, event.address, event.eventType, event.startDate, event.endDate, event.startTime, event.endTime, event.dateCreated, event.status);

    return u;
}

app.get('/', (req, res) => {
    let message = req.query.message || "event-service";

    res.status(200).send(message);
})

app.get("/event-id/:id", async (req, res) => {
    const id = req.params.id;
    let event = await getEvent(id);

    if (event === null){
        res.status(404).send("No event with such ID was found.");
    }

    res.json(createEventResponse(event));
})

async function getEvent(id){
    const query = "SELECT * FROM " + EVENTS_TABLE + " WHERE id = " + id;

    let results = await doQuery(query);

    if (results.length === 0){
        return null;
    } else {
        return createEvent(results[0]);
    }
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