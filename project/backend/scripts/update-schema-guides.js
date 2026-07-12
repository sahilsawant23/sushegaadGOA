const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'goa_db',
};

async function updateSchema() {
    let conn;
    try {
        conn = await mysql.createConnection(dbConfig);
        console.log('Connected to database.');

        // Add columns if they don't exist
        const columns = [
            'ADD COLUMN IF NOT EXISTS languages VARCHAR(255) DEFAULT "English, Hindi"',
            'ADD COLUMN IF NOT EXISTS experience_years INT DEFAULT 1',
            'ADD COLUMN IF NOT EXISTS image_url TEXT'
        ];

        for (const col of columns) {
            try {
                await conn.execute(`ALTER TABLE guides ${col}`);
                console.log(`Executed: ALTER TABLE guides ${col}`);
            } catch (e) {
                console.log(`Column might already exist or error: ${e.message}`);
            }
        }

        console.log('Schema update complete.');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        if (conn) await conn.end();
    }
}

updateSchema();
