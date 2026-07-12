const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'goa_db'
};

async function verifySnapshot() {
    let conn;
    try {
        console.log('Connecting...');
        conn = await mysql.createConnection(dbConfig);

        console.log('Checking bookings for snapshot title...');
        const [rows] = await conn.execute(`
            SELECT id, tour_id, booked_tour_title 
            FROM bookings 
            LIMIT 5
        `);

        console.log('Bookings Snapshot Data:', rows);

        if (rows.length > 0 && rows[0].booked_tour_title) {
            console.log('SUCCESS: Bookings have snapshotted titles.');
        } else if (rows.length > 0) {
            console.log('WARNING: Some bookings might be missing titles.');
        } else {
            console.log('No bookings to check.');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        if (conn) await conn.end();
    }
}

verifySnapshot();
