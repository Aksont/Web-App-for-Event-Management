// exports.hey = (req, res) => {
//     let message = req.query.message || "standard-messageee";
    
//     res.status(200).send(message);
// }

const express = require('express');
const app = express();

app.get('/', (req, res) => {
    let message = req.query.message || "standard-messageee";

    res.status(200).send(message);
})

app.get('/hello', (req, res) => {
    res.status(200).send("hello");
})

exports.hey = app;