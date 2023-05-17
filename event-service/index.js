const express = require('express');
const mysql = require('mysql');
const cors = require("cors");

const app = express();
app.use(cors());

const EVENTS_TABLE = "events";
const EVENTS_DESC_TABLE = "events_desc";
// const USER_EVENT_ROLES_TABLE = "user_event_roles";
const EVENT_PRICES_TABLE = "event_prices";

class Event {
    constructor(id, organizerEmail, name, address, city, eventType, startDate, endDate, startTime, endTime, dateCreated, status='ACTIVE') {
        this.id = id;
        this.organizerEmail = organizerEmail;
        this.name = name;
        this.address = address;
        this.city = city;
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
    constructor(eventData) {
        this.organizerEmail = eventData.organizerEmail;
        this.name = eventData.name;
        this.address = eventData.address;
        this.city = eventData.city;
        this.eventType = eventData.eventType;
        this.startDate = eventData.startDate;
        this.endDate = eventData.endDate;
        this.startTime = eventData.startTime;
        this.endTime = eventData.endTime;
        this.price = eventData.price;
        this.description = eventData.description;
    }
}

class EventResponse {
    constructor(id, organizerEmail, name, address, city, eventType, startDate, endDate, startTime, endTime, dateCreated, status) {
        this.id = id;
        this.organizerEmail = organizerEmail;
        this.name = name;
        this.address = address;
        this.city = city;
        this.eventType = eventType;
        this.startDate = startDate;
        this.endDate = endDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.dateCreated = dateCreated;
        this.status = status;
        this.eventDescText = "";
    }
}

function createEvent(data) {
    let e = new Event(data.id, data.organizerEmail, data.name, data.address, data.city, data.eventType, data.startDate, data.endDate, data.startTime, data.endTime, data.dateCreated, data.status);

    return e;
}

function createNewEvent(data) {
    // console.log(data)
    let e = new Event("", data.organizerEmail, data.name, data.address, data.city.toLowerCase(), data.eventType, data.startDate, data.endDate, data.startTime, data.endTime, getTodayDate(), "PENDING");

    return e;
}

function createEventDTO(data) {
    let u = new EventDTO(data);

    return u;
}

async function createEventResponse(event) {
    let u = new EventResponse(event.id, event.organizerEmail, event.name, event.address, event.city, event.eventType, event.startDate, event.endDate, event.startTime, event.endTime, event.dateCreated, event.status);
    let eventDesc = await getEventDesc(event.id);

    if (eventDesc){
        u.eventDescText = eventDesc.descText;
    }

    // console.log(u);

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

// class Role {
//     constructor(id, userId, eventId, role, status) {
//         this.id = id;
//         this.userId = userId;
//         this.eventId = eventId;
//         this.role = role;
//         this.status = status;
//     }
// }

// function createRole(data) {
//     let r = new Role(data.id, data.userId, data.eventId, data.role, data.status);

//     return r;
// }

// class RoleDTO {
//     constructor(userId, eventId, role) {
//         this.userId = userId;
//         this.eventId = eventId;
//         this.role = role;
//     }
// }

// function createRoleDTO(data) {
//     let r = new RoleDTO(data.userId, data.eventId, data.role);

//     return r;
// }

// function createRoleDTOs(data) {
//     let roleDTOs = []
    
//     for (let rd of data){
//         let r = new RoleDTO(data.userId, data.eventId, data.role);
//         roleDTOs.push(r);
//     }

//     return roleDTOs;
// }

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

    return res.status(200).send(message);
})

app.get("/event/:id", async (req, res) => {
    const id = req.params.id;
    let event = await getEvent(id);

    if (!event){
        return res.status(404).send("No event with such ID was found.");
    }

    let eventResponse = await createEventResponse(event);

    return res.json(eventResponse);
})

app.get("/available-events", async (req, res) => {
    const events = await getAvailableEvents();
    let eventResponses = []

    for (let e of events){
        const eventResponse = await createEventResponse(e);
        eventResponses.push(eventResponse);
    }

    return res.json(eventResponses);
})

app.get("/pending-events", async (req, res) => {
    const events = await getPendingEvents();
    let eventResponses = []

    for (let e of events){
        const eventResponse = await createEventResponse(e);
        eventResponses.push(eventResponse);
    }

    return res.json(eventResponses);
})

app.get("/events/:email", async (req, res) => {
    const email = req.params.email;
    const events = await getUserEvents(email);
    let eventResponses = []

    for (let e of events){
        const eventResponse = await createEventResponse(e);
        eventResponses.push(eventResponse);
    }

    return res.json(eventResponses);
})

app.put("/approve/:id", async (req, res) => {
    const id = req.params.id;
    let event = await getEvent(id);

    if (!event){
        return res.status(404).send("No event with such ID was found.");
    }

    let hasUpdated = await approveEvent(event.id);

    if (hasUpdated){
        event.status = "ACTIVE";
        const eventResponse = await createEventResponse(event);
        return res.json(eventResponse);
    } else {
        return res.status(409).send("Did not approve event.");
    }
})

app.put("/deny/:id", async (req, res) => {
    const id = req.params.id;
    let event = await getEvent(id);

    if (!event){
        return res.status(404).send("No event with such ID was found.");
    }

    let hasUpdated = await denyEvent(event.id);

    if (hasUpdated){
        event.status = "DENIED";
        const eventResponse = await createEventResponse(event);
        return res.json(eventResponse);
    } else {
        return res.status(409).send("Did not deny event.");
    }
})

app.post("/create-event", async (req, res) => {
    const eventDTO = createEventDTO(req.body);
    
    if (!validateNewEventData(eventDTO)){
        return res.status(400).send("Invalid event data.");
    }

    let newEvent = createNewEvent(eventDTO);
    const query = fillInsertEventQuery(newEvent);
    const sqlOkPacket = await doQuery(query); // sqlOkPacket is a return value when inserting/updating sql table
    const eventId = sqlOkPacket.insertId;

    if (!eventId){
        return res.status(400).send("Did not create new event.");
    }

    const isOkay = await addEventDesc(eventId, eventDTO.description);

    if (!isOkay){
        return res.status(409).send("Did not update description."); 
    }

    await addEventPrice(eventId, eventDTO.price);
    newEvent.id = eventId;
    const eventResponse = await createEventResponse(newEvent);

    return res.json(eventResponse);
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
        return res.status(404).send("No event with such ID was found.");
    }

    if (!newDescText){
        return res.status(409).send("Error with new description."); 
    }

    let isOkay = await addEventDesc(event.id, newDescText);

    if (!isOkay){
        return res.status(409).send("Did not update description."); 
    }
    
    return res.send("Updated description successfully."); 

})

app.get("/price/:id", async (req, res) => {
    const id = req.params.id;
    let event = await getEvent(id);

    // console.log(event);

    if (event === null){
        return res.status(404).send("No event with such ID was found.");
    }

    let price = await getEventPrice(id);

    // console.log(price);

    return res.json(price.price);
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

// app.get("/user-roles-for-event/:userId/:eventId", async (req, res) => {
//     const userId = req.params.userId;
//     const eventId = req.params.eventId;

//     let roles = await getRoles(userId, eventId);

//     res.json(roles);
// })

// // *TODO* reorganize so that DTO takes email and then finds userId by email, in response also send emails
// // for later use
// // MAIN_ORG, ORGANIZER, PERFORMER
// app.post("/add-role/:id", async (req, res) => {
//     const roleDTO = createRoleDTO(req.body);
//     const id = req.params.id;
//     let event = await getEvent(id);

//     if (event === null){
//         res.status(404).send("No event with such ID was found.");
//     }

//     if (doesAlreadyHaveSuchRole(roleDTO)){
//         res.status(409).send("User already has the same role assigned.");
//     } 

//     let isOkay = await addRole(event.id, newDescText);

//     if (!isOkay){
//         res.status(409).send("Did not add role."); 
//     }
    
//     res.send("Added role successfully."); 
// })

// // when creating event
// app.post("/add-roles-event-creation/:id", async (req, res) => {
//     const roleDTOs = createRoleDTOs(req.body);
//     const id = req.params.id;
//     let event = await getEvent(id);

//     if (event === null){
//         res.status(404).send("No event with such ID was found.");
//     }

//     // no need to check since this is creation of the event thus no previous roles exist
//     // if (doesAlreadyHaveSuchRole(roleDTO)){
//     //     res.status(409).send("User already has the same role assigned.");
//     // } 

//     for (let r of roleDTOs){
//         addRole(event.id, newDescText);
//     } 
    
//     res.send("Added role successfully."); 
// })

// app.delete("/delete-role/:userId/:eventId", async (req, res) => {
//     const userId = req.params.userId;
//     const eventId = req.params.eventId;

//     let hasDeactivated = await deleteRole(userId, eventId);

//     if (hasDeactivated){
//         res.send("Deleted role successfully.");
//     } else {
//         res.status(409).send("Did not delete role.");
//     }
// })

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
    try {
        const todayDate = getTodayDate();
        const startDate = parseDateFromString(eventDTO.startDate);
        const endDate = parseDateFromString(eventDTO.endDate);

        if (todayDate >= startDate){
            return false;
        } else if (startDate > endDate) {
            return false;
        } else if (startDate === endDate){
            const startTime = parseTimeFromString(eventDTO.startTime);
            const endTime = parseTimeFromString(eventDTO.startTime);

            if (!validateTime(startDate) || !validateTime(endTime)){
                return false
            }
            else if (startTime >= endTime){
                return false;
            }
        }

        return true;
    } catch (error) {
        return false;
    }
}

function parseDateFromString(dateString) {
    const [year, month, day] = dateString.split('-').map(Number);
    
    return new Date(year, month - 1, day);
}

function parseTimeFromString(timeString) {
    const [hours, minutes] = timeString.split(':').map(Number);

    return { hours, minutes };
  }

function validateTime(time) {
    const hours = time.hours;
    const minutes = time.minutes;

    if (hours > 23 || hours < 0){
        return false;
    } else if (minutes > 59 || minutes < 0){
        return false;
    }

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

async function getActiveEvent(id){
    const e = await getEvent(id, "ACTIVE");
    
    return e;
}

async function getPendingEvent(id){
    const e = await getEvent(id, "PENDING");
    
    return e;
}

async function getEvent(id, status=""){
    let query;

    if (status.length > 0) {
        query = "SELECT * FROM " + EVENTS_TABLE + " WHERE id = " + id + " AND status = " + sqlStr(status) ;
    } else {
        query = "SELECT * FROM " + EVENTS_TABLE + " WHERE id = " + id;
    }

    let results = await doQuery(query);

    if (results.length === 0){
        return null;
    } else {
        return createEvent(results[0]);
    }
}

async function getPendingEvents(){
    let events = [];
    const query = "SELECT * FROM " + EVENTS_TABLE + " WHERE status = " + sqlStr("PENDING");

    let results = await doQuery(query);

    if (!!results){
        for (let i in results){
            events.push(createEvent(results[i]))
        }
    }

    return events;
}

async function getUserEvents(email){
    let events = [];
    const query = "SELECT * FROM " + EVENTS_TABLE + " WHERE organizerEmail = " + sqlStr(email);

    let results = await doQuery(query);

    if (!!results){
        for (let i in results){
            events.push(createEvent(results[i]))
        }
    }

    return events;
}

async function getAvailableEvents(){
    let events = [];
    const query = "SELECT * FROM " + EVENTS_TABLE + " WHERE status = " + sqlStr("ACTIVE")
                                                + " AND ("
                                                + "(startDate > " + sqlStr(getTodayDate()) + ")"
                                                + " OR "
                                                + "(startDate = " + sqlStr(getTodayDate()) + " AND startTime > " + sqlStr(getCurrentTime()) + ")"
                                                + ")"
                                                ;

    let results = await doQuery(query);

    if (!!results){
        for (let i in results){
            events.push(createEvent(results[i]))
        }
    }

    return events;
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

function getCurrentTime() {
    const currentTime = new Date();
    const hours = String(currentTime.getHours()).padStart(2, '0');
    const minutes = String(currentTime.getMinutes()).padStart(2, '0');

    return `${hours}:${minutes}`;
}
  
  // Get the current time

async function deleteEvent(id){
    const query = "UPDATE " + EVENTS_TABLE + " SET status = " + sqlStr("DELETED") + " WHERE id = " + id;
    let sqlOkPacket = await doQuery(query);

    return sqlOkPacket.changedRows === 1;
}

async function approveEvent(id){
    const query = "UPDATE " + EVENTS_TABLE + " SET status = " + sqlStr("ACTIVE") + " WHERE id = " + id;
    let sqlOkPacket = await doQuery(query);

    return sqlOkPacket.changedRows === 1;
}

async function denyEvent(id){
    const query = "UPDATE " + EVENTS_TABLE + " SET status = " + sqlStr("DENIED") + " WHERE id = " + id;
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

// async function doesAlreadyHaveSuchRole(userId, eventId, role){
//     let roles = await getRoles(userId, eventId);

//     for (let r of roles){
//         if (r.role === role){
//             return true;
//         }
//     }

//     return false;
// }

// async function getRoles(userId, eventId){
//     const query = "SELECT * FROM " + USER_EVENT_ROLES_TABLE 
//                 + " WHERE userId = " + userId 
//                 + " AND eventId = " + eventId 
//                 + " AND status = " + sqlStr("ACTIVE")
//                 ;
    
//     let roles = []
//     let results = await doQuery(query);

//     if (results.length !== 0){
//         for (let r of results){
//             roles.push(createRole(r));
//         }
//     }

//     return roles;
// }

// async function addRole(roleDTO){
//     const query = "INSERT INTO " + USER_EVENT_ROLES_TABLE + " (userId, eventId, role, status) VALUES (" 
//     + sqlStr(roleDTO.userId) + "," 
//     + sqlStr(roleDTO.eventId) + "," 
//     + sqlStr(roleDTO.role) + "," 
//     + sqlStr("ACTIVE") + 
//     ")";

//     let sqlOkPacket = await doQuery(query);

//     return sqlOkPacket.insertId !== null && sqlOkPacket.insertId !== undefined;
// }

// async function deleteRole(userId, eventId){
//     const query = "UPDATE " + USER_EVENT_ROLES_TABLE + " SET status = " + sqlStr("DELETED") + " WHERE userId = " + userId + " AND eventId = " + eventId;
//     let sqlOkPacket = await doQuery(query);

//     return sqlOkPacket.changedRows === 1;
// }

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
    const query = "INSERT INTO " + EVENTS_TABLE + " (name, organizerEmail, address, city, eventType, startDate, endDate, startTime, endTime, dateCreated, status) VALUES (" 
    + sqlStr(event.name) + "," 
    + sqlStr(event.organizerEmail) + ","
    + sqlStr(event.address) + ","
    + sqlStr(event.city) + ","
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