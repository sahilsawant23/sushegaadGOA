
const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

async function migrate() {
    let conn;
    try {
        conn = await mysql.createConnection(dbConfig);
        console.log('Connected to database.');

        // Add 'gallery_images' column if not runs
        try {
            await conn.query(`
                ALTER TABLE destinations 
                ADD COLUMN gallery_images JSON NULL AFTER image_url;
            `);
            console.log("Added 'gallery_images' column.");
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log("'gallery_images' column already exists.");
            } else {
                throw err;
            }
        }

        // Add 'details' column if not runs
        try {
            await conn.query(`
                ALTER TABLE destinations 
                ADD COLUMN details JSON NULL AFTER gallery_images;
            `);
            console.log("Added 'details' column.");
        } catch (err) {
            if (err.code === 'ER_DUP_FIELDNAME') {
                console.log("'details' column already exists.");
            } else {
                throw err;
            }
        }

        console.log('Migration completed successfully.');

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        if (conn) await conn.end();
    }
}

migrate();
