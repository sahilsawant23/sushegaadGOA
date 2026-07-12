const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

// Load env vars
dotenv.config({ path: path.join(__dirname, '../.env') });

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'goa_db',
    multipleStatements: true
};

async function migrate() {
    let conn;
    try {
        conn = await mysql.createConnection(dbConfig);
        console.log('Connected to database.');

        // 1. Add is_verified and whatsapp_number to guides
        console.log('Adding verified and whatsapp columns to guides...');
        try {
            await conn.execute(`
                ALTER TABLE guides 
                ADD COLUMN is_verified BOOLEAN DEFAULT FALSE,
                ADD COLUMN whatsapp_number VARCHAR(20)
            `);
            console.log('Columns added to guides table.');
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') {
                console.log('Columns already exist in verified table.');
            } else {
                console.error('Error altering guides table:', e.message);
            }
        }

        // 2. Add guide_id to tours (to link a tour to a host)
        console.log('Adding guide_id to tours...');
        try {
            await conn.execute(`
                ALTER TABLE tours
                ADD COLUMN guide_id INT,
                ADD FOREIGN KEY (guide_id) REFERENCES guides(id)
            `);
            console.log('Column guide_id added to tours.');
        } catch (e) {
            if (e.code === 'ER_DUP_FIELDNAME') {
                console.log('Column guide_id already in tours.');
            } else {
                console.error('Error altering tours table:', e.message);
            }
        }

        console.log('Migration completed successfully.');

    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        if (conn) conn.end();
    }
}

migrate();
