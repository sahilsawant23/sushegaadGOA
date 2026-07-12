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

async function addGalleryColumn() {
    try {
        const connection = await mysql.createConnection(dbConfig);
        console.log('Connected to database.');

        // Add gallery_images column (TEXT or JSON)
        try {
            await connection.execute(`
                ALTER TABLE events
                ADD COLUMN gallery_images TEXT; 
            `);
            console.log('Added gallery_images column.');
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log('gallery_images column already exists.');
            } else {
                throw err;
            }
        }

        await connection.end();
    } catch (error) {
        console.error('Error updating schema:', error);
    }
}

addGalleryColumn();
