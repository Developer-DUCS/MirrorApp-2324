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
const myUser = "andrew";
let db = "";
if (myUser == "sam") {
	db = mysql.createConnection({
		host: config.sam_local_db[0].host,
		user: config.sam_local_db[0].user,
		password: config.sam_local_db[0].password,
		database: config.sam_local_db[0].database,
		port: config.sam_local_db[0].port,
	});
} else if (myUser == "daniel") {
	db = mysql.createConnection({
		host: config.daniel_local_db[0].host,
		user: config.daniel_local_db[0].user,
		password: config.daniel_local_db[0].password,
		database: config.daniel_local_db[0].database,
		port: config.daniel_local_db[0].port,
	});
} else if (myUser == "thomasN") {
	db = mysql.createConnection({
		host: config.thomasN_local_db[0].host,
		user: config.thomasN_local_db[0].user,
		password: config.thomasN_local_db[0].password,
		database: config.thomasN_local_db[0].database,
		port: config.thomasN_local_db[0].port,
	});
} else if (myUser == "thomasNWIN") {
	db = mysql.createConnection({
		host: config.thomasN_local_db_WIN[0].host,
		user: config.thomasN_local_db_WIN[0].user,
		password: config.thomasN_local_db_WIN[0].password,
		database: config.thomasN_local_db_WIN[0].database,
		port: config.thomasN_local_db_WIN[0].port,
	});
} else if (myUser == "haley") {
	db = mysql.createConnection({
		host: config.haley_local_db[0].host,
		user: config.haley_local_db[0].user,
		password: config.haley_local_db[0].password,
		database: config.haley_local_db[0].database,
		port: config.haley_local_db[0].port,
	});
} else if (myUser == "thomasO") {
	db = mysql.createConnection({
		host: config.thomasO_local_db[0].host,
		user: config.thomasO_local_db[0].user,
		password: config.thomasO_local_db[0].password,
		database: config.thomasO_local_db[0].database,
		port: config.thomasO_local_db[0].port,
	});
} else if (myUser == "du_mirror_user") {
	db = mysql.createConnection({
		host: config.du_mirror_user[0].host,
		user: config.du_mirror_user[0].user,
		password: config.du_mirror_user[0].password,
		database: config.du_mirror_user[0].database,
		port: config.du_mirror_user[0].port,
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
