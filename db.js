require('dotenv').config()
const mysql = require("mysql2")
const connection = mysql.createConnection({
    host: 'localhost' || process.env.DATABASE_HOST,
    user: 'root' || process.env.DATABASE_USER,
    password: 'root' || process.env.DATABASE_PASSWORD,
    database: 'lms' || process.env.DATABASE_NAME,
});

connection.connect((err) => {
    if (err) {
        console.error('Error connecting to the database:', err.stack);
        return;
    }
    console.log('Connected to the database.');
});

module.exports = connection