const mysql = require('mysql2/promise');
require('dotenv').config(); 

// Creating a connection "pool". 

const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10, 
    queueLimit: 0
});

// Testing the connection when the app starts
pool.getConnection()
    .then(connection => {
        console.log('Successfully connected to the MySQL database.');
        connection.release(); 
    })
    .catch(err => {
        console.error('Error connecting to the MySQL database:', err);
    });

module.exports = pool;