const mysql = require('mysql');

const pool = mysql.createPool({
    connectionLimit: 10,
    host: 'localhost',
    user: 'your-username',
    password: 'your-password',
    database: 'your-database-name'
});

module.exports = { pool };