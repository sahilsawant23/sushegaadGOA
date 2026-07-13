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
        console.log('Connecting to database...');
        conn = await mysql.createConnection(dbConfig);

        console.log('Altering wishlist table column item_id to VARCHAR(255)...');
        try {
            await conn.execute('ALTER TABLE wishlist MODIFY item_id VARCHAR(255) NOT NULL');
            console.log('✅ Modified item_id to VARCHAR(255) in wishlist table.');
        } catch (e) {
            console.error('❌ Error modifying item_id column:', e.message);
        }

        console.log('Creating realtime_places_cache table if not exists...');
        await conn.execute(`
            CREATE TABLE IF NOT EXISTS realtime_places_cache (
                id VARCHAR(100) PRIMARY KEY,
                name VARCHAR(255) NOT NULL,
                type VARCHAR(50) NOT NULL,
                location VARCHAR(255),
                region VARCHAR(100),
                description TEXT,
                price_range VARCHAR(50),
                opening_hours VARCHAR(100),
                image VARCHAR(500),
                rating DECIMAL(3,2),
                review_count INT,
                latitude DECIMAL(10, 8),
                longitude DECIMAL(11, 8),
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        console.log('✅ realtime_places_cache table created/verified.');

    } catch (error) {
        console.error('❌ Migration failed:', error);
    } finally {
        if (conn) {
            await conn.end();
            console.log('Database connection closed.');
        }
    }
}

migrate();
