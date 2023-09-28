// mongodb.js 
// Created: 11/26/2023
// Purpose: 
//      Establish a connection with the mongo database which will be used to store images
// 
// Modification Log: 
//

const {MongoClient} = require('mongodb');


// example connecting to database
//
async function main() {

    //password protected: replace <password> with mongo password
    const uri = `mongodb+srv://charlieroder:<password>@dumirrorimages.jv5lyuz.mongodb.net/?retryWrites=true&w=majority&appName=AtlasApp`;

    const client= new MongoClient(uri);
 
    try {
        // Connect to the MongoDB cluster
        await client.connect();
 
        // Make the appropriate DB calls
        // TO DO: must make a generalized function similar to executeQuery in mysqldb.js
        await  listDatabases(client);
 
    } catch (e) {
        console.error(e);
    } finally {
        await client.close();
    }
}

async function listDatabases(client){
    databasesList = await client.db().admin().listDatabases();
 
    console.log("Databases:");
    databasesList.databases.forEach(db => console.log(` - ${db.name}`));
};

main().catch(console.error);
//
// end of example


export default async function executeQuery({ query, values }) {
	console.log(query);
    console.log(values);
}

// these functions could be moved to /api folder
async function addImage(client, value) {
    try {
        
    }
    catch {
        
    }
}

async function getImage(client, value) {
    try {
        
    }
    catch {
        
    }
}