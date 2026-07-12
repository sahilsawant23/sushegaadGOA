const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'goa_db'
};

async function checkOrphans() {
    let conn;
    try {
        console.log('Connecting...');
        conn = await mysql.createConnection(dbConfig);

        console.log('Checking for bookings with invalid tour_ids...');
        const [rows] = await conn.execute(`
            SELECT b.id, b.tour_id, b.status 
            FROM bookings b
            LEFT JOIN tours t ON b.tour_id = t.id
            WHERE t.id IS NULL
        `);

        if (rows.length > 0) {
            console.log(`Found ${rows.length} orphaned bookings:`);
            console.log(rows);
            console.log('These are the ones showing "Tour Details Unavailable".');
        } else {
            console.log('No orphaned bookings found. All bookings point to valid tours.');
        }

        const [allTours] = await conn.execute('SELECT id, title FROM tours');
        console.log('\nValid Tour IDs:', allTours.map(t => t.id));

    } catch (error) {
        console.error('Error:', error);
    } finally {
        if (conn) await conn.end();
    }
}

checkOrphans();
