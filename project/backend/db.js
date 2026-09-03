const mysql = require('mysql2/promise');

const dotenv = require('dotenv');

// Ensure env vars are loaded
if (!process.env.DB_HOST) {
    dotenv.config();
}

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'goa_db',
    port: parseInt(process.env.DB_PORT || '3306', 10),
    ssl: process.env.DB_SSL === 'true'
        ? { rejectUnauthorized: false }
        : undefined,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
};

const pool = mysql.createPool(dbConfig);

// Test connection
pool.getConnection()
    .then(conn => {
        console.log('Database pool connected successfully');
        conn.release();
    })
    .catch(err => {
        console.error('Database pool connection failed:', err.message);

        if (err.code === 'ECONNREFUSED') {
            console.error(
                'Hint: Make sure your MySQL database server is running on ' +
                dbConfig.host + ':' + (dbConfig.port || 3306)
            );
        }
    });

module.exports = pool;