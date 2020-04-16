const mysql = require('mysql');
const { database } = require('./credenciales')
const { promisify } = require('util');

const pool = mysql.createPool(database);
pool.getConnection((err, connection) => {
    if (err) {
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            console.log(err.code)
        }
        if (err.code === 'ER_CON_COUNT_ERROR') {
            console.log(err.code)
        }
        if (err.code === 'ECONNREFUSED') {
            console.log(err.code)
        }
    }
    if (connection) {
        connection.release();
    }
    console.log('Database is connected successfully');
    return;
})

pool.query = promisify(pool.query);

module.exports = pool;