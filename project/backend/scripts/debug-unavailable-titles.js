const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'goa_db'
};

async function checkUnavailableTitles() {
    let conn;
    try {
        console.log('Connecting...');
        conn = await mysql.createConnection(dbConfig);

        console.log("Checking for bookings that would return 'Tour Details Unavailable'...");
        // Same query mechanism as routes.js
        const [rows] = await conn.execute(`
            SELECT b.id, b.tour_id, t.title 
            FROM bookings b
            LEFT JOIN tours t ON b.tour_id = t.id
            WHERE t.title IS NULL
        `);

        if (rows.length > 0) {
            console.log(`Found ${rows.length} problematic bookings:`);
            console.log(rows);
            // Delete them?
            console.log('Deleting these specifically...');
            await conn.execute(`
                DELETE b FROM bookings b
                LEFT JOIN tours t ON b.tour_id = t.id
                WHERE t.title IS NULL
            `);
            console.log('Deleted.');
        } else {
            console.log('No bookings found with missing tour titles.');
        }

    } catch (error) {
        console.error('Error:', error);
    } finally {
        if (conn) await conn.end();
    }
}

checkUnavailableTitles();
