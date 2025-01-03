require('dotenv').config()
const mysql = require('mysql2/promise');
const pool = mysql.createPool({
    host: "localhost",
    user: "root",
    password: "root",
    database: "lms",
    waitForConnections: true,
    connectionLimit: 10, // Number of connections in the pool
    queueLimit: 0
});


module.exports = pool