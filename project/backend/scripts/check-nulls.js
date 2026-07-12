const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

async function checkNulls() {
    let conn;
    try {
        conn = await mysql.createConnection(dbConfig);
        console.log('Connected to database.');

        const [rows] = await conn.execute('SELECT id, name, region, category FROM destinations WHERE category IS NULL OR region IS NULL');

        if (rows.length > 0) {
            console.log('Found rows with NULL category or region:');
            console.table(rows);
        } else {
            console.log('No rows with NULL category or region found.');
        }

    } catch (error) {
        console.error('Check failed:', error);
    } finally {
        if (conn) await conn.end();
    }
}

checkNulls();
