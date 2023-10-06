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

/*
// test
const conn = mongoose.createConnection(uri);

let gfs;

conn.once('open', () => {
    gfs = Grid(conn.db, mongoose.mongo);
    gfs.collection('images');
})

const storage = new GridFsStorage({
    url: uri,
    file: (req, file) => {
        return new Promise((resolve, reject) => {
            crypto.randomBytes(16, (err, buf) => {
                if (err) {
                    return reject(err);
                }
                const filename = buf.toString('hex') + path.extname(file.originalname);
                const fileInfo = {
                    filename: filename,
                    bucketName: 'images'
                };
                resolve(fileInfo);
            });
        });
    }
});
const upload = multer({ storage });
//

//export default
async function getClient() {
    try {
        await client.connect();
        console.log("connected");
        return client;
    } catch (error) {
        console.log(error.stack);
    }
    finally{
        await client.close();
    }

    console.log("done")
}

module.exports = getClient;
*/