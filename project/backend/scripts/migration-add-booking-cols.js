const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'goa_db'
};

async function addMissingColumns() {
    let conn;
    try {
        console.log('Connecting...');
        conn = await mysql.createConnection(dbConfig);

        console.log('Checking columns...');
        const [columns] = await conn.execute(`SHOW COLUMNS FROM bookings`);
        const colNames = columns.map(c => c.Field);

        if (!colNames.includes('status')) {
            console.log('Adding status column...');
            await conn.execute("ALTER TABLE bookings ADD COLUMN status VARCHAR(20) DEFAULT 'confirmed' AFTER total_price");
        } else {
            console.log('status column exists.');
        }

        if (!colNames.includes('guide_id')) {
            console.log('Adding guide_id column...');
            await conn.execute("ALTER TABLE bookings ADD COLUMN guide_id INT AFTER tour_id");
        } else {
            console.log('guide_id column exists.');
        }

        console.log('Migration complete.');

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        if (conn) await conn.end();
    }
}

addMissingColumns();
