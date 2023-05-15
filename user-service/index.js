const express = require('express');
const mysql = require('mysql');
const app = express();


const USERS_TABLE = "users";
const USERS_BIO_TABLE = "users_bio";

class User {
    constructor(id, name, lastname, userType, email, password, status='ACTIVE') {
        this.id = id;
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
        this.bioText = ""; //TODO
    }
}

function createUser(data) {
    let u = new User(data.id, data.name, data.lastname, data.userType, data.email, data.password, data.status);

    return u;
}

// function createNewUser(userDTO) {
//     let u = new User(userDTO.name, userDTO.lastname, userDTO.userType, userDTO.email, userDTO.password);

//     return u;
// }

function createUserDTO(data) {
    let u = new UserDTO(data.name, data.lastname, data.userType, data.email, data.password);

    return u;
}

function createUserResponse(user) {
    let u = new UserResponse(user.name, user.lastname, user.userType, user.email);

    return u;
}

class UserBio {
    constructor(id, userId, bioText) {
        this.id = id;
        this.userId = userId;
        this.bioText = bioText;
    }
}

// class UserBioResponse {
//     constructor(email, bioText) {
//         this.email = email;
//         this.bioText = bioText;
//     }
// }

function createUserBio(data) {
    let bio = new UserBio(data.id, data.userId, data.bioText);

    return bio;
}

// function createUserBioResponse(email, bioText="") {
//     let bio = new UserBioResponse(email, bioText);

//     return bio;
// }

app.get('/', (req, res) => {
    let message = req.query.message || "user-service";

    res.status(200).send(message);
})

app.get('/hello', (req, res) => {
    res.status(200).send("user-service");
})

app.get("/user-id/:id", async (req, res) => {
    const id = req.params.id;
    let user = await getUserById(id);

    if (user === null){
        res.status(404).send("No user with such ID was found.");
    }

    res.json(createUserResponse(user));
})

app.get("/user-email/:email", async (req, res) => {
    const email = req.params.email;
    let user = await getUserByEmail(email);

    if (user === null){
        res.status(404).send("No user with such email was found.");
    }

    res.json(createUserResponse(user));
})

app.post("/register", async (req, res) => {
    let userDTO = createUserDTO(req.body);
    let user = await getUserByEmail(userDTO.email);

    if (user !== null){
        res.status(409).send("Email is already in use.");
    }

    // user = createNewUser(userDTO);
    // const query = fillInsertUserQuery(user);
    const query = fillInsertUserQuery(userDTO);
    let sqlOkPacket = await doQuery(query); // sqlOkPacket is a return value when inserting/updating sql table
    
    if (!sqlOkPacket.insertId){
        res.status(400).send("Did not register new user.");
    }

    user = await getUserByEmail(userDTO.email);
    console.log(user);
    res.json(createUserResponse(user));
})

// TODO: button for password update (don't combine with bio update)
// this currently updates only password
app.put("/update-info/:email", async (req, res) => {
    const email = req.params.email;
    const newPassword = req.body.password;
    let user = await getUserByEmail(email);

    if (user === null){
        res.status(404).send("No user with such email was found.");
    } else if (user.password === newPassword) {
        res.status(400).send("Can not change the same password.");
    }

    let hasUpdated = await updatePassword(user.id, newPassword);

    if (hasUpdated){
        res.send("Updated password successfully.");
    } else {
        res.status(409).send("Did not update password.");
    }
})

// not neccessary if bio is going to be merged into UserResponse
//
// app.get("/user-bio/:email", async (req, res) => {
//     const email = req.params.email;
//     let user = await getUserByEmail(email);

//     if (user === null){
//         res.status(404).send("No user with such email was found.");
//     }

//     let userBio = await getUserBio(user.id);

//     if (userBio){
//         res.json(createUserBioResponse(user.email, userBio.bioText));
//     } else {
//         res.json(createUserBioResponse(user.email));
//     }
// })

// TODO: button for bio update (don't combine with password update)
app.post("/add-bio/:email", async (req, res) => {
    const email = req.params.email;
    const newBioText = req.body.bioText;
    let user = await getUserByEmail(email);

    if (user === null){
        res.status(404).send("No user with such email was found.");
    }

    let isOkay = await addUserBio(user.id, newBioText);

    if (!isOkay){
        res.status(409).send("Did not update bio."); 
    }
    
    res.send("Updated bio successfully."); 
})

// TODO update info of an existing user
app.delete("/delete-user/:email", async (req, res) => {
    const email = req.params.email;
    let user = await getUserByEmail(email);
    console.log(user);

    if (user === null){
        res.status(404).send("No user with such email was found.");
    }

    // tickets should not be refunded, nor disabled
    // reviews should not be removed, their visualisuation should only be anonymized ("deleted user")
    // no need to deactivate profile picture, a default one will be shown anyway
    // events should not be removed or deactivated even if creator's profile is deleted

    let hasDeactivated = await deleteUser(user.id);
    if (hasDeactivated){
        res.send("Deleted user successfully.");
    } else {
        res.status(409).send("Did not delete user.");
    }
})

async function deleteUser(id){
    const query = "UPDATE " + USERS_TABLE + " SET status = " + sqlStr("DELETED") + " WHERE id = " + id;
    let sqlOkPacket = await doQuery(query);

    return sqlOkPacket.changedRows === 1;
}

async function updatePassword(id, password){
    const query = "UPDATE " + USERS_TABLE + " SET password = " + sqlStr(password) + " WHERE id = " + id;
    let sqlOkPacket = await doQuery(query);

    return sqlOkPacket.changedRows === 1;
}

async function addUserBio(userId, newBioText){
    let userBio = await getUserBio(userId);
    let isOkay;

    if (userBio){
        isOkay = updateUserBio(userId, newBioText);
    } else {
        isOkay = addNewUserBio(userId, newBioText);
    }

    return isOkay;
}

async function updateUserBio(userId, newBioText){
    const query = "UPDATE " + USERS_BIO_TABLE + " SET bioText = " + sqlStr(newBioText) + " WHERE userId = " + userId;
    let sqlOkPacket = await doQuery(query);

    return sqlOkPacket.changedRows === 1;
}

async function addNewUserBio(userId, newBioText){
    const query = "INSERT INTO " + USERS_BIO_TABLE + " (userId, bioText) VALUES (" 
    + userId + "," 
    + sqlStr(newBioText) + 
    ")";

    let sqlOkPacket = await doQuery(query);

    return sqlOkPacket.insertId !== null && sqlOkPacket.insertId !== undefined;
}

async function getUserBio(userId){
    const query = "SELECT * FROM " + USERS_BIO_TABLE + " WHERE userId = " + userId;
    let results = await doQuery(query);

    if (results.length === 0){
        return null;
    } else {
        return createUserBio(results[0]);
    }
}

async function getUserByEmail(email){
    const query = "SELECT * FROM " + USERS_TABLE + " WHERE email = " + sqlStr(email) + " AND status = " + sqlStr("ACTIVE");
    
    return await getUser(query);
}

async function getUserById(id){
    const query = "SELECT * FROM " + USERS_TABLE + " WHERE id = " + id;
    
    return await getUser(query);
}

async function getUser(query){
    let results = await doQuery(query);

    if (results.length === 0){
        return null;
    } else {
        return createUser(results[0]);
    }
}

function fillInsertUserQuery(user) {
    const query = "INSERT INTO " + USERS_TABLE + " (name, lastname, userType, email, status, password) VALUES (" 
    + sqlStr(user.name) + "," 
    + sqlStr(user.lastname) + ","
    + sqlStr(user.userType) + ","
    + sqlStr(user.email) + ","
    + sqlStr("ACTIVE") + ","
    + sqlStr(user.password) + 
    ")";

    return query;
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