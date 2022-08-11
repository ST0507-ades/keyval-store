require('dotenv').config();
const mysql = require('mysql2');

const connectionConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_DATABASE,
    ssl: { rejectUnauthorized: true },
    connectionLimit: 10,
};

let db;
if (process.env.NODE_ENV === 'test') {
    const connection = mysql.createConnection(connectionConfig);
    db = connection.promise();
} else {
    const pool = mysql.createPool(connectionConfig);
    db = pool.promise();
}

module.exports = {
    query: (sql, params) => {
        console.log('SENDING QUERY | ', sql, params);
        return db.execute(sql, params);
    },
    end: () => db.end(),
    MYSQL_ERROR_CODE: {
        DUPLICATE_ENTRY: 1062,
    },
};
