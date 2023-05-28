const express = require('express');
const mysql = require('mysql');
const cors = require("cors");

const app = express();
app.use(cors());

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

function createLoginDTO(data) {
    let loginDTO = {"email":data.email, "password":data.password};

    return loginDTO;
}

function createUserDTO(data) {
    let u = new UserDTO(data.name, data.lastname, data.userType, data.email, data.password);

    return u;
}

function createUserResponse(user) {
    let u = new UserResponse(user.name, user.lastname, user.userType, user.email);

    return u;
}

class ChangePasswordDTO {
    constructor(email, password, newPassword, retypedPassword) {
        this.email = email;
        this.password = password;
        this.newPassword = newPassword;
        this.retypedPassword = retypedPassword;
    }
}

function createChangePasswordDTO(data) {
    let cp = new ChangePasswordDTO(data.email, data.password, data.newPassword, data.retypedPassword);

    return cp;
}

class UserBio {
    constructor(id, userId, bioText) {
        this.id = id;
        this.userId = userId;
        this.bioText = bioText;
    }
}

function createUserBio(data) {
    let bio = new UserBio(data.id, data.userId, data.bioText);

    return bio;
}

app.post("/login", async (req, res) => {
    let loginDTO = createLoginDTO(req.body);
    let user = await getUserByEmail(loginDTO.email);

    if (!!user && isPasswordCorrect(user, loginDTO.password)){
        return res.json(createUserResponse(user));
    }

    return res.status(409).send("Wrong login.");
})

function isPasswordCorrect(user, loginPassword){
    let isCorrect = user.password === loginPassword; 
    
    return isCorrect;
}

function isPasswordOfValidFormat(password){
    let isCorrect = password.length >= 6; 
    
    return isCorrect;
}

app.put("/change-password", async (req, res) => {
    let cpDTO = createChangePasswordDTO(req.body);
    let user = await getUserByEmail(cpDTO.email);

    if (!user){
        return res.status(409).send("User with such email does not exist.");
    } else if (!isPasswordCorrect(user, cpDTO.password)){
        return res.status(409).send("Incorrect old password.");
    } else if (!isPasswordOfValidFormat(cpDTO.newPassword)){
        return res.status(409).send("New password is not of valid format.");
    } else if (cpDTO.newPassword !== cpDTO.retypedPassword){
        return res.status(409).send("Passwords do not match.");
    }

    await changePassword(cpDTO.email, cpDTO.newPassword); // sqlOkPacket is a return value when inserting/updating sql table

    return res.json(createUserResponse(user));
})

async function changePassword(email, newPassword){
    const query = "UPDATE " + USERS_TABLE + " SET password = " + sqlStr(newPassword) + " WHERE email = " + sqlStr(email);
    let sqlOkPacket = await doQuery(query);

    return sqlOkPacket.changedRows === 1;
}

app.post("/register", async (req, res) => {
    let userDTO = createUserDTO(req.body);
    let user = await getUserByEmail(userDTO.email);

    if (!!user){
        return res.status(409).send("Email is already in use.");
    } else if (!isPasswordOfValidFormat(userDTO.password)){
        return res.status(409).send("Password is not of valid format.");
    }

    const query = fillInsertUserQuery(userDTO);
    let sqlOkPacket = await doQuery(query); // sqlOkPacket is a return value when inserting/updating sql table
    
    if (!sqlOkPacket.insertId){
        return res.status(400).send("Did not register new user.");
    }

    user = await getUserByEmail(userDTO.email);

    return res.json(createUserResponse(user));
})

// NOT USED
app.get("/user-id/:id", async (req, res) => {
    const id = req.params.id;
    let user = await getUserById(id);

    if (user === null){
        return res.status(404).send("No user with such ID was found.");
    }

    return res.json(createUserResponse(user));
})

// NOT USED
app.get("/user-email/:email", async (req, res) => {
    const email = req.params.email;
    let user = await getUserByEmail(email);

    if (user === null){
        return res.status(404).send("No user with such email was found.");
    }

    return res.json(createUserResponse(user));
})

// NOT USED
// TODO: button for password update (don't combine with bio update)
// this currently updates only password
app.put("/update-info/:email", async (req, res) => {
    const email = req.params.email;
    const newPassword = req.body.password;
    let user = await getUserByEmail(email);

    if (user === null){
        return res.status(404).send("No user with such email was found.");
    } else if (user.password === newPassword) {
        return res.status(400).send("Can not change the same password.");
    }

    let hasUpdated = await updatePassword(user.id, newPassword);

    if (hasUpdated){
        return res.send("Updated password successfully.");
    } else {
        return res.status(409).send("Did not update password.");
    }
})

// NOT USED
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

// NOT USED
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