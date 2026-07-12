require('dotenv').config();
const mysql = require('mysql2/promise');

console.log('Current Working Directory:', process.cwd());
console.log('DB Config:', {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    // Show first/last char of password if exists, else undefined
    password: process.env.DB_PASSWORD ?
        `${process.env.DB_PASSWORD[0]}***${process.env.DB_PASSWORD[process.env.DB_PASSWORD.length - 1]}` :
        'undefined',
    database: process.env.DB_NAME,
});

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'goa_db',
};

async function testConnection() {
    try {
        const conn = await mysql.createConnection(dbConfig);
        console.log('Connection successful!');
        await conn.end();
    } catch (error) {
        console.error('Connection failed:', error.code, error.message);
    }
}

testConnection();
