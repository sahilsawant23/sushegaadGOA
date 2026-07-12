
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

async function listDestinations() {
    let conn;
    try {
        conn = await mysql.createConnection(dbConfig);
        const [rows] = await conn.execute('SELECT name, category FROM destinations ORDER BY category, name');
        console.log('Existing Destinations:');
        rows.forEach(row => console.log(`[${row.category}] ${row.name}`));
    } catch (error) {
        console.error('Error:', error);
    } finally {
        if (conn) await conn.end();
    }
}

listDestinations();
