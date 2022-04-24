const mysql = require('mysql2');

const db = mysql.createPool({
    host: 'localhost',
    user: 'root',
    database: 'csc317db',
    password: 'cSc3|7ProjecktR3D'
});

module.exports = db.promise();