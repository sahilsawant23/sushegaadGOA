const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'goa_db'
};

async function addSnapshotColumn() {
    let conn;
    try {
        console.log('Connecting...');
        conn = await mysql.createConnection(dbConfig);

        console.log('Checking columns...');
        const [columns] = await conn.execute(`SHOW COLUMNS FROM bookings`);
        const colNames = columns.map(c => c.Field);

        if (!colNames.includes('booked_tour_title')) {
            console.log('Adding booked_tour_title column...');
            await conn.execute("ALTER TABLE bookings ADD COLUMN booked_tour_title VARCHAR(255)");
        }

        console.log('Backfilling existing bookings...');
        // Copy title from tours table to bookings table
        await conn.execute(`
            UPDATE bookings b
            JOIN tours t ON b.tour_id = t.id
            SET b.booked_tour_title = t.title
            WHERE b.booked_tour_title IS NULL
        `);

        console.log('Migration complete.');

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        if (conn) await conn.end();
    }
}

addSnapshotColumn();
