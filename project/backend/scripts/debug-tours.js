const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

async function checkTours() {
    let conn;
    try {
        conn = await mysql.createConnection(dbConfig);
        const [rows] = await conn.execute('SELECT count(*) as count FROM tours');
        console.log('Tours count:', rows[0].count);

        // Check specific tour_id if known (from previous debug log it was 10)
        const [tour] = await conn.execute('SELECT * FROM tours WHERE id = 10');
        console.log('Tour 10:', tour.length > 0 ? 'Exists' : 'Missing');

    } catch (error) {
        console.error('Error:', error);
    } finally {
        if (conn) await conn.end();
    }
}

checkTours();
