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

        console.log('Creating guides table...');
        await conn.execute(`
            CREATE TABLE IF NOT EXISTS guides (
                id INT AUTO_INCREMENT PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                contact VARCHAR(255),
                specialty VARCHAR(255),
                status VARCHAR(50) DEFAULT 'available',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('Guides table created.');

        // Add guide_id to bookings if not exists (referenced in routes.js)
        try {
            await conn.execute('ALTER TABLE bookings ADD COLUMN guide_id INT');
            console.log('Added guide_id to bookings.');
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') console.log('guide_id already in bookings.');
            else console.error('Error adding guide_id:', e.message);
        }

    } catch (error) {
        console.error('Migration error:', error);
    } finally {
        if (conn) await conn.end();
    }
}

migrate();
