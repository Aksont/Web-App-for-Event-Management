const express = require('express');
const mysql = require('mysql');
const app = express();

app.get('/', (req, res) => {
    let message = req.query.message || "standard-messageee";

    res.status(200).send(message);
})

app.get('/hello', (req, res) => {
    res.status(200).send("hello");
})

app.get("/db", async (req, res) => {
    const query = "SELECT * FROM tickets";
    console.log("tu sam")

    pool.query(query, [], (error, results) => {
        if (error){
            console.log(error);
            res.send(error);
        } else {
            console.log(results)
            if (!results){
                res.status(404).send("Not found");
            } else {
                res.json(results);
            }
        }
    });
})

app.post("/db", (req, res) => {
    const data = {
        id : req.body.id,
        price : req.body.price,
        userId : req.body.userId,
        eventId : req.body.eventId 
    }

    const query = "INSERT INTO tickets (id, price, userId, eventId) VALUES (" 
    + data.id + "," 
    + data.price + ","
    + data.userId + ","
    + data.eventId +
    ")";
    
    pool.query(query, data, (error, results) => {
        if (error){
            console.log(error);
            res.send(error);
        } else {
            console.log(results)
            if (!results){
                res.status(404).send("Not found");
            } else {
                res.json(results);
            }
        }
    });
})

app.delete("/db/:id", (req, res) => {
    const id = req.params.id;
    const query = "DELETE FROM tickets WHERE id=?";
    
    pool.query(query, id, (error, results) => {
        if (error){
            console.log(error);
            res.send(error);
        } else {
            console.log(results)
            if (!results){
                res.status(404).send("Not found");
            } else {
                res.json(results);
            }
        }
    });
})

const pool = mysql.createPool({
    user: "root", // process.env.DB_USER
    password: "diplomski", // process.env.DB_PASS
    database: "ticket", // process.env.DB_NAME
    // socketPath: "/cloudsql/diplomski-379607:us-central1:diplomski", // process.env.INSTANCE_CONNECTION_NAME
    host: "35.184.63.121"  
});

exports.appfunc = app;