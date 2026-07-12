const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'goa_db'
};

async function cleanOrphans() {
    let conn;
    try {
        console.log('Connecting...');
        conn = await mysql.createConnection(dbConfig);

        console.log('Deleting orphaned bookings...');
        const [result] = await conn.execute(`
            DELETE b FROM bookings b
            LEFT JOIN tours t ON b.tour_id = t.id
            WHERE t.id IS NULL
        `);

        console.log(`Deleted ${result.affectedRows} invalid bookings.`);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        if (conn) await conn.end();
    }
}

cleanOrphans();
