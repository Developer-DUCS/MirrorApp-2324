// mysqldb.js
// Created: 9/28/2022
// Purpose:
//  Establish a connection between the application and the database.
//
// Modification Log:
//  9/28/2022: Created file and got it to connect. (Samuel R, Thomas N, Daniel B)

const mysql = require("mysql2"); // Needed mysql2 for the authentication handshake to work
const config = require("./mysqlconfig.json"); // Configuration file for the mysql connection

// Connection variable that holds the configuration details
// var connThomasUbuntu = mysql.createConnection ({
//     host: config.host,
//     user: config.user,
//     password: config.password,
//     database: config.database,
//     port: config.port
// });

// Change the myUser variable to your username
const myUser = "du_mirror_dev";
let db = "";
if (myUser == "du_mirror_user") {
	db = mysql.createConnection({
		host: config.du_mirror_user[0].host,
		user: config.du_mirror_user[0].user,
		password: config.du_mirror_user[0].password,
		database: config.du_mirror_user[0].database,
		port: config.du_mirror_user[0].port,
	});
} else if (myUser == "du_mirror_dev") {
	db = mysql.createConnection({
		host: config.du_mirror_dev[0].host,
		user: config.du_mirror_dev[0].user,
		password: config.du_mirror_dev[0].password,
		database: config.du_mirror_dev[0].database,
		port: config.du_mirror_dev[0].port,
	});
} else if (myUser == "charlie") {
	db = mysql.createConnection({
		host: config.charlie[0].host,
		user: config.charlie[0].user,
		password: config.charlie[0].password,
		database: config.charlie[0].database,
		port: config.charlie[0].port,
	});
} else if (myUser == "andrew") {
	db = mysql.createConnection({
		host: config.andrew[0].host,
		user: config.andrew[0].user,
		password: config.andrew[0].password,
		database: config.andrew[0].database,
		port: config.andrew[0].port,
	});
}



db.connect(function (err) {
	//console.log(`host: ${conn.host}\nuser: ${conn.user}\npassword: ${conn.password}\ndatabase: ${conn.database}\nport: ${conn.port}`);
	if (err) {
		console.log("Error establishing mysql connection");
		console.log(err);
	} else {
		console.log("connection established");
	}
});
module.exports = db;