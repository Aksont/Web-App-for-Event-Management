const express = require('express');
const mysql = require('mysql');
const app = express();

const MAIN_TABLE = "users";

class User {
    constructor(name, lastname, userType, email, password, status='ACTIVE') {
      this.name = name;
      this.lastname = lastname;
      this.userType = userType;
      this.email = email;
      this.status = status;
      this.password = password;
    }
}

class UserDTO {
    constructor(name, lastname, userType, email, password) {
      this.name = name;
      this.lastname = lastname;
      this.userType = userType;
      this.email = email;
      this.password = password;
    }
}

class UserResponse {
    constructor(name, lastname, userType, email) {
      this.name = name;
      this.lastname = lastname;
      this.userType = userType;
      this.email = email;
    }
}

function createUser(data) {
    let u = new User(data.name, data.lastname, data.userType, data.email, data.password, data.status);

    return u;
}

function createNewUser(userDTO) {
    let u = new User(userDTO.name, userDTO.lastname, userDTO.userType, userDTO.email, userDTO.password);

    return u;
}

function createUserDTO(data) {
    let u = new UserDTO(data.name, data.lastname, data.userType, data.email, data.password);

    return u;
}

function createUserResponse(user) {
    let u = new UserResponse(user.name, user.lastname, user.userType, user.email);

    return u;
}

app.get('/', (req, res) => {
    let message = req.query.message || "user-service";

    res.status(200).send(message);
})

app.get('/hello', (req, res) => {
    res.status(200).send("user-service");
})

app.get("/user/:id", async (req, res) => {
    const id = req.params.id;
    const query = "SELECT * FROM " + MAIN_TABLE + " WHERE id = " + id;
    let results = await doQuery(query);
    // console.log(results)
    
    if (results.length !== 0 && results !== null){
        let user = createUser(results[0]);
        let userResponse = createUserResponse(user);
        res.json(userResponse);
    } else {
        res.status(404).send("No user with such ID was found.");
    }
})

app.post("/register", async (req, res) => {
    let userDTO = createUserDTO(req.body);
    let isEmailOkay = await isEmailOkayForUse(userDTO.email);

    if (!isEmailOkay){
        res.status(409).send("Email is already in use.");
    } // add additional validations if neccessary 

    let user = createNewUser(userDTO);
    const query = fillInsertUserQuery(user);
    let insertionDetails = await doQuery(query);
    
    if (insertionDetails.insertId){
        let userResponse = createUserResponse(user);
        console.log(userResponse);
        res.json(userResponse);
    } else {
        res.status(400).send("Did not register new user.");
    }
})

// TODO update info of an existing user
app.put("/update-info/:id", async (req, res) => {

})

// TODO update info of an existing user
app.delete("/remove-user/:id", async (req, res) => {

})

// TODO add or edit bio
app.post("/add-bio/:id", async (req, res) => {

})

// TODO add or edit bio
app.post("/add-bio/:id", async (req, res) => {

})

// app.get("/user/:id", async (req, res) => {
//     const query = "SELECT * FROM tickets";

//     pool.query(query, [], (error, results) => {
//         if (error){
//             console.log(error);
//             res.send(error);
//         } else {
//             console.log(results)
//             if (!results){
//                 res.status(404).send("Not found");
//             } else {
//                 res.json(results);
//             }
//         }
//     });
// })

// app.post("/db", (req, res) => {
//     const data = {
//         id : req.body.id,
//         price : req.body.price,
//         userId : req.body.userId,
//         eventId : req.body.eventId 
//     }

//     const query = "INSERT INTO tickets (id, price, userId, eventId) VALUES (" 
//     + data.id + "," 
//     + data.price + ","
//     + data.userId + ","
//     + data.eventId +
//     ")";
    
//     pool.query(query, data, (error, results) => {
//         if (error){
//             console.log(error);
//             res.send(error);
//         } else {
//             console.log(results)
//             if (!results){
//                 res.status(404).send("Not found");
//             } else {
//                 res.json(results);
//             }
//         }
//     });
// })

// app.delete("/db/:id", (req, res) => {
//     const id = req.params.id;
//     const query = "DELETE FROM tickets WHERE id=?";
    
//     pool.query(query, id, (error, results) => {
//         if (error){
//             console.log(error);
//             res.send(error);
//         } else {
//             console.log(results)
//             if (!results){
//                 res.status(404).send("Not found");
//             } else {
//                 res.json(results);
//             }
//         }
//     });
// })

async function isEmailOkayForUse(email){
    const query = "SELECT * FROM " + MAIN_TABLE + " WHERE email = " + sqlStr(email) + " AND status = " + sqlStr("ACTIVE");
    let results = await doQuery(query);
    let isOkay = results.length === 0;

    return isOkay;
}

function fillInsertUserQuery(user) {
    const query = "INSERT INTO " + MAIN_TABLE + " (name, lastname, userType, email, status, password) VALUES (" 
    + sqlStr(user.name) + "," 
    + sqlStr(user.lastname) + ","
    + sqlStr(user.userType) + ","
    + sqlStr(user.email) + ","
    + sqlStr(user.status) + ","
    + sqlStr(user.password) + 
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