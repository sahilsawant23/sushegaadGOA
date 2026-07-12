const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'goa_db'
};

async function addGuestsColumn() {
    let conn;
    try {
        console.log('Connecting to database...');
        conn = await mysql.createConnection(dbConfig);

        console.log('Checking bookings table...');
        const [columns] = await conn.execute(`
            SELECT COLUMN_NAME 
            FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'bookings' AND COLUMN_NAME = 'guests'
        `, [dbConfig.database]);

        if (columns.length === 0) {
            console.log('Adding guests column...');
            await conn.execute('ALTER TABLE bookings ADD COLUMN guests INT DEFAULT 1');
            console.log('Column added successfully.');
        } else {
            console.log('Guests column already exists.');
        }

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        if (conn) await conn.end();
    }
}

addGuestsColumn();
