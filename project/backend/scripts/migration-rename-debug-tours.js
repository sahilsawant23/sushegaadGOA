const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'goa_db'
};

async function renameTours() {
    let conn;
    try {
        console.log('Connecting...');
        conn = await mysql.createConnection(dbConfig);

        console.log('Updating tour titles...');
        const [result] = await conn.execute(`
            UPDATE tours 
            SET title = 'Baga Beach Watersports', 
                description = 'Experience the thrill of jet skiing, parasailing, and more at Baga Beach.'
            WHERE title LIKE 'Debug Tour%'
        `);

        console.log(`Updated ${result.affectedRows} tours.`);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        if (conn) await conn.end();
    }
}

renameTours();
