const express = require('express');
const mysql = require('mysql');
const app = express();

const EVENTS_TABLE = "events";
const EVENTS_DESC_TABLE = "events_desc";
const USER_EVENT_ROLES_TABLE = "user_event_roles";
const EVENT_PRICES_TABLE = "event_prices";

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
    constructor(name, address, eventType, startDate, endDate, startTime, endTime) {
        this.name = name;
        this.address = address;
        this.eventType = eventType;
        this.startDate = startDate;
        this.endDate = endDate;
        this.startTime = startTime;
        this.endTime = endTime;
    }
}

class EventResponse {
    constructor(id, name, address, eventType, startDate, endDate, startTime, endTime, dateCreated, status) {
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
        this.mainOrganizator = null;  //TODO
        this.organizers = []; //TODO
        this.performers = []; //TODO
        this.eventDescText = "";
    }
}

function createEvent(data) {
    let e = new Event(data.id, data.name, data.address, data.eventType, data.startDate, data.endDate, data.startTime, data.endTime, data.dateCreated, data.status);

    return e;
}

function createNewEvent(data) {
    console.log(data)
    let e = new Event("", data.name, data.address, data.eventType, data.startDate, data.endDate, data.startTime, data.endTime, getTodayDate());

    return e;
}

function createEventDTO(data) {
    let u = new EventDTO(data.name, data.address, data.eventType, data.startDate, data.endDate, data.startTime, data.endTime);

    return u;
}

async function createEventResponse(event) {
    //TODO add mainOrganizator, organizers, performers
    let u = new EventResponse(event.id, event.name, event.address, event.eventType, event.startDate, event.endDate, event.startTime, event.endTime, event.dateCreated, event.status);
    let eventDesc = await getEventDesc(event.id);

    if (eventDesc){
        u.eventDescText = eventDesc.descText;
    }

    return u;
}

class EventDesc {
    constructor(id, eventId, descText) {
        this.id = id;
        this.eventId = eventId;
        this.descText = descText;
    }
}

function createEventDesc(data) {
    let desc = new EventDesc(data.id, data.eventId, data.descText);

    return desc;
}

class Role {
    constructor(id, userId, eventId, role, status) {
        this.id = id;
        this.userId = userId;
        this.eventId = eventId;
        this.role = role;
        this.status = status;
    }
}

function createRole(data) {
    let r = new Role(data.id, data.userId, data.eventId, data.role, data.status);

    return r;
}

class RoleDTO {
    constructor(userId, eventId, role) {
        this.userId = userId;
        this.eventId = eventId;
        this.role = role;
    }
}

function createRoleDTO(data) {
    let r = new RoleDTO(data.userId, data.eventId, data.role);

    return r;
}

function createRoleDTOs(data) {
    let roleDTOs = []
    
    for (let rd of data){
        let r = new RoleDTO(data.userId, data.eventId, data.role);
        roleDTOs.push(r);
    }

    return roleDTOs;
}

class Price {
    constructor(id, eventId, price, dateCreated) {
        this.id = id;
        this.price = price;
        this.eventId = eventId;
        this.dateCreated = dateCreated;
    }
}

function createPrice(data) {
    let p = new Price(data.id, data.eventId, data.price, data.dateCreated);

    return p;
}

app.get('/', (req, res) => {
    let message = req.query.message || "event-service";

    res.status(200).send(message);
})

app.get("/event/:id", async (req, res) => {
    const id = req.params.id;
    let event = await getEvent(id);

    if (event === null){
        res.status(404).send("No event with such ID was found.");
    }

    let eventResponse = await createEventResponse(event);

    res.json(eventResponse);
})

app.post("/create-event", async (req, res) => {
    console.log(req.body)
    console.log(req.body.name)
    let eventDTO = createEventDTO(req.body);
    
    if (!validateNewEventData(eventDTO)){
        res.status(400).send("Invalid event data.");
    }

    let newEvent = createNewEvent(eventDTO);
    let query = fillInsertEventQuery(newEvent);
    let sqlOkPacket = await doQuery(query); // sqlOkPacket is a return value when inserting/updating sql table
    
    if (!sqlOkPacket.insertId){
        res.status(400).send("Did not create new event.");
    }

    newEvent.id = sqlOkPacket.insertId;
    res.json(createEventResponse(newEvent));
})

app.delete("/event/:id", async (req, res) => {
    const id = req.params.id;
    let event = await getEvent(id);

    if (event === null){
        res.status(404).send("No event with such ID was found.");
    }

    // TODO reimburse and deactivate tickets

    let hasDeactivated = await deleteEvent(event.id);
    if (hasDeactivated){
        res.send("Deleted event successfully.");
    } else {
        res.status(409).send("Did not delete event.");
    }
})

app.post("/description/:id", async (req, res) => {
    const newDescText = req.body.descText;
    const id = req.params.id;
    let event = await getEvent(id);

    if (event === null){
        res.status(404).send("No event with such ID was found.");
    }

    if (!newDescText){
        res.status(409).send("Error with new description."); 
    }

    let isOkay = await addEventDesc(event.id, newDescText);

    if (!isOkay){
        res.status(409).send("Did not update description."); 
    }
    
    res.send("Updated description successfully."); 

})

app.get("/price/:id", async (req, res) => {
    const id = req.params.id;
    let event = await getEvent(id);

    console.log(event);

    if (event === null){
        res.status(404).send("No event with such ID was found.");
    }

    let price = await getEventPrice(id);

    console.log(price);

    res.json(price.price);
})

app.post("/price/:eventId", async (req, res) => {
    const id = req.params.eventId;
    const newPrice = req.body.newPrice;
    let event = await getEvent(id);

    if (event === null){
        res.status(404).send("No event with such ID was found.");
    }

    let oldPrice = await getEventPrice(id);

    if (!!oldPrice){
        deactivateOldPrice(oldPrice.id);
    }

    await addEventPrice(id, newPrice);
    res.send("Successfully updated event price");
})

app.get("/user-roles-for-event/:userId/:eventId", async (req, res) => {
    const userId = req.params.userId;
    const eventId = req.params.eventId;

    let roles = await getRoles(userId, eventId);

    res.json(roles);
})

// *TODO* reorganize so that DTO takes email and then finds userId by email, in response also send emails
// for later use
// MAIN_ORG, ORGANIZER, PERFORMER
app.post("/add-role/:id", async (req, res) => {
    const roleDTO = createRoleDTO(req.body);
    const id = req.params.id;
    let event = await getEvent(id);

    if (event === null){
        res.status(404).send("No event with such ID was found.");
    }

    if (doesAlreadyHaveSuchRole(roleDTO)){
        res.status(409).send("User already has the same role assigned.");
    } 

    let isOkay = await addRole(event.id, newDescText);

    if (!isOkay){
        res.status(409).send("Did not add role."); 
    }
    
    res.send("Added role successfully."); 
})

// when creating event
app.post("/add-roles-event-creation/:id", async (req, res) => {
    const roleDTOs = createRoleDTOs(req.body);
    const id = req.params.id;
    let event = await getEvent(id);

    if (event === null){
        res.status(404).send("No event with such ID was found.");
    }

    // no need to check since this is creation of the event thus no previous roles exist
    // if (doesAlreadyHaveSuchRole(roleDTO)){
    //     res.status(409).send("User already has the same role assigned.");
    // } 

    for (let r of roleDTOs){
        addRole(event.id, newDescText);
    } 
    
    res.send("Added role successfully."); 
})

app.delete("/delete-role/:userId/:eventId", async (req, res) => {
    const userId = req.params.userId;
    const eventId = req.params.eventId;

    let hasDeactivated = await deleteRole(userId, eventId);

    if (hasDeactivated){
        res.send("Deleted role successfully.");
    } else {
        res.status(409).send("Did not delete role.");
    }
})

app.post("/add-review/:id", async (req, res) => {
    // TODO
})

app.delete("/delete-review/:id", async (req, res) => {
    // TODO
})

app.get("/filter", async (req, res) => {
    // TODO
})

function validateNewEventData(eventDTO){
    // TODO
    // valid date
    // start date today or after
    // end date == start date or after
    // if same date, end time after start time
    return true;
}

async function getEventPrice(eventId){
    const query = "SELECT * FROM " + EVENT_PRICES_TABLE + " WHERE eventId = " + eventId + " AND status = " + sqlStr("ACTIVE") ;

    let results = await doQuery(query);

    if (results.length === 0){
        return null;
    } else {
        return createPrice(results[0]);
    }
}

async function deactivateOldPrice(oldPriceId){
    const query = "UPDATE " + EVENT_PRICES_TABLE + " SET status = " + sqlStr("INACTIVE") + " WHERE id = " + oldPriceId;
    let sqlOkPacket = await doQuery(query);

    return sqlOkPacket.changedRows === 1;
}

async function addEventPrice(eventId, price){
    const query = "INSERT INTO " + EVENT_PRICES_TABLE + " (eventId, price, status, dateCreated) VALUES (" 
    + sqlStr(eventId) + "," 
    + sqlStr(price) + "," 
    + sqlStr("ACTIVE") + ","
    + sqlStr(getTodayDate())
    + ")";

    let sqlOkPacket = await doQuery(query);

    return sqlOkPacket.insertId !== null && sqlOkPacket.insertId !== undefined;
}

async function getEvent(id){
    const query = "SELECT * FROM " + EVENTS_TABLE + " WHERE id = " + id + " AND status = " + sqlStr("ACTIVE") ;

    let results = await doQuery(query);

    if (results.length === 0){
        return null;
    } else {
        return createEvent(results[0]);
    }
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

async function deleteEvent(id){
    const query = "UPDATE " + EVENTS_TABLE + " SET status = " + sqlStr("DELETED") + " WHERE id = " + id;
    let sqlOkPacket = await doQuery(query);

    return sqlOkPacket.changedRows === 1;
}

async function addEventDesc(eventId, newDescText){
    let eventDesc = await getEventDesc(eventId);
    let isOkay;

    if (eventDesc){
        isOkay = updateEventDesc(eventId, newDescText);
    } else {
        isOkay = addNewEventDesc(eventId, newDescText);
    }

    return isOkay;
}

async function doesAlreadyHaveSuchRole(userId, eventId, role){
    let roles = await getRoles(userId, eventId);

    for (let r of roles){
        if (r.role === role){
            return true;
        }
    }

    return false;
}

async function getRoles(userId, eventId){
    const query = "SELECT * FROM " + USER_EVENT_ROLES_TABLE 
                + " WHERE userId = " + userId 
                + " AND eventId = " + eventId 
                + " AND status = " + sqlStr("ACTIVE")
                ;
    
    let roles = []
    let results = await doQuery(query);

    if (results.length !== 0){
        for (let r of results){
            roles.push(createRole(r));
        }
    }

    return roles;
}

async function addRole(roleDTO){
    const query = "INSERT INTO " + USER_EVENT_ROLES_TABLE + " (userId, eventId, role, status) VALUES (" 
    + sqlStr(roleDTO.userId) + "," 
    + sqlStr(roleDTO.eventId) + "," 
    + sqlStr(roleDTO.role) + "," 
    + sqlStr("ACTIVE") + 
    ")";

    let sqlOkPacket = await doQuery(query);

    return sqlOkPacket.insertId !== null && sqlOkPacket.insertId !== undefined;
}

async function deleteRole(userId, eventId){
    const query = "UPDATE " + USER_EVENT_ROLES_TABLE + " SET status = " + sqlStr("DELETED") + " WHERE userId = " + userId + " AND eventId = " + eventId;
    let sqlOkPacket = await doQuery(query);

    return sqlOkPacket.changedRows === 1;
}

async function updateEventDesc(eventId, newDescText){
    const query = "UPDATE " + EVENTS_DESC_TABLE + " SET descText = " + sqlStr(newDescText) + " WHERE eventId = " + eventId;
    let sqlOkPacket = await doQuery(query);

    return sqlOkPacket.changedRows === 1;
}

async function addNewEventDesc(eventId, newDescText){
    const query = "INSERT INTO " + EVENTS_DESC_TABLE + " (eventId, descText) VALUES (" 
    + eventId + "," 
    + sqlStr(newDescText) + 
    ")";

    let sqlOkPacket = await doQuery(query);

    return sqlOkPacket.insertId !== null && sqlOkPacket.insertId !== undefined;
}

async function getEventDesc(eventId){
    const query = "SELECT * FROM " + EVENTS_DESC_TABLE + " WHERE eventId = " + eventId;
    let results = await doQuery(query);

    if (results.length === 0){
        return null;
    } else {
        return createEventDesc(results[0]);
    }
}

function fillInsertEventQuery(event) {
    const query = "INSERT INTO " + EVENTS_TABLE + " (name, address, eventType, startDate, endDate, startTime, endTime, dateCreated, status) VALUES (" 
    + sqlStr(event.name) + "," 
    + sqlStr(event.address) + ","
    + sqlStr(event.eventType) + ","
    + sqlStr(event.startDate) + ","
    + sqlStr(event.endDate) + ","
    + sqlStr(event.startTime) + ","
    + sqlStr(event.endTime) + ","
    + sqlStr(event.dateCreated) + ","
    + sqlStr(event.status) + 
    ")";

    return query;
}

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