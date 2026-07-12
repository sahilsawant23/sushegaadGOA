const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

async function checkBookings() {
    let conn;
    try {
        conn = await mysql.createConnection(dbConfig);
        console.log('Connected to database.');

        const [rows] = await conn.execute('SELECT * FROM bookings ORDER BY created_at DESC');
        console.log('Bookings found:', rows.length);
        console.log(JSON.stringify(rows, null, 2));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        if (conn) await conn.end();
    }
}

checkBookings();
