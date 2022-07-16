const mysql = require("mysql2");

const pool  = mysql.createPool({
    connectionLimit : 10,
    host            : 'localhost',
    user            : 'root',
    database        : 'ordering_simplified'
});

module.exports = pool;
