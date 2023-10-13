// mongodb.js 
// Created: 11/26/2023
// Purpose: 
//      Establish a connection with the mongo database which will be used to store images
// 
// Modification Log: 
//
const mongoose = require('mongoose');

const dbCredentials = {
    username: "charlieroder",
    password: "PSNsZwwExGlrsKfP",
    database: "dumirrorimages",
}

const uri = `mongodb+srv://${dbCredentials.username}:${dbCredentials.password}@${dbCredentials.database}.jv5lyuz.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp`;

mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

const db = mongoose.connection;

module.exports = db;