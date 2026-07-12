
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

async function updateSchema() {
    let conn;
    try {
        conn = await mysql.createConnection(dbConfig);
        console.log('Connected to database.');

        // Add phone, location, bio to users table
        const columns = [
            { name: 'phone', def: 'VARCHAR(20)' },
            { name: 'location', def: 'VARCHAR(255)' },
            { name: 'bio', def: 'TEXT' }
        ];

        for (const col of columns) {
            try {
                // Check existence first to avoid error spam
                const [exists] = await conn.execute(
                    `SHOW COLUMNS FROM users LIKE '${col.name}'`
                );
                if (exists.length === 0) {
                    await conn.execute(`ALTER TABLE users ADD COLUMN ${col.name} ${col.def}`);
                    console.log(`Added column: ${col.name}`);
                } else {
                    console.log(`Column ${col.name} already exists.`);
                }
            } catch (e) {
                console.log(`Error adding ${col.name}: ${e.message}`);
            }
        }

        console.log('Schema update complete.');

    } catch (error) {
        console.error('Schema update failed:', error);
    } finally {
        if (conn) await conn.end();
    }
}

updateSchema();
