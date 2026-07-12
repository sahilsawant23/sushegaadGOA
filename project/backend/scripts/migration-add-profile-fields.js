const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'goa_db',
};

async function migrate() {
    let conn;
    try {
        console.log('Connecting...');
        conn = await mysql.createConnection(dbConfig);

        console.log('Adding missing columns to users table...');

        // Add phone
        try {
            await conn.execute('ALTER TABLE users ADD COLUMN phone VARCHAR(20)');
            console.log('Added phone column.');
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') console.log('phone column already exists.');
            else console.error('Error adding phone:', e.message);
        }

        // Add location
        try {
            await conn.execute('ALTER TABLE users ADD COLUMN location VARCHAR(100)');
            console.log('Added location column.');
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') console.log('location column already exists.');
            else console.error('Error adding location:', e.message);
        }

        // Add bio
        try {
            await conn.execute('ALTER TABLE users ADD COLUMN bio TEXT');
            console.log('Added bio column.');
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') console.log('bio column already exists.');
            else console.error('Error adding bio:', e.message);
        }

        console.log('Migration complete.');

    } catch (error) {
        console.error('Migration error:', error);
    } finally {
        if (conn) await conn.end();
    }
}

migrate();
