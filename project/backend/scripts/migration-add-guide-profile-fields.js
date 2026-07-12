const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'goa_db'
};

async function migrate() {
    console.log('Adding extra profile fields to guides table...');
    let conn;
    try {
        conn = await mysql.createConnection(dbConfig);

        const columns = [
            "ADD COLUMN bio TEXT",
            "ADD COLUMN languages VARCHAR(500)",
            "ADD COLUMN experience_years INT",
            "ADD COLUMN image_url VARCHAR(500)",
            "ADD COLUMN whatsapp_number VARCHAR(20)"
        ];

        for (const col of columns) {
            try {
                await conn.query(`ALTER TABLE guides ${col}`);
                console.log(`Executed: ${col}`);
            } catch (e) {
                if (e.code === 'ER_DUP_FIELDNAME') {
                    console.log(`Skipped (already exists): ${col}`);
                } else {
                    console.error(`Error executing ${col}:`, e.message);
                }
            }
        }

        console.log('Migration completed.');
    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        if (conn) await conn.end();
    }
}

migrate();
