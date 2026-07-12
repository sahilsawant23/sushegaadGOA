const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'goa_db'
};

async function testBookingsQuery() {
    let conn;
    try {
        console.log('Connecting...');
        conn = await mysql.createConnection(dbConfig);

        console.log('1. Checking booking columns...');
        const [cols] = await conn.execute(`SHOW COLUMNS FROM bookings`);
        console.log('Columns:', cols.map(c => c.Field));

        console.log('\n2. Running the GET /bookings Query...');
        const [rows] = await conn.execute(`
          SELECT b.*, 
                 COALESCE(t.title, 'Tour Details Unavailable') as tour_title, 
                 t.image_url, t.description as tour_description, t.duration_hours,
                 d.name as location,
                 g.name as guide_name, g.contact as guide_contact
          FROM bookings b
          LEFT JOIN tours t ON b.tour_id = t.id
          LEFT JOIN destinations d ON t.destination_id = d.id
          LEFT JOIN guides g ON b.guide_id = g.id
          LIMIT 1
        `);
        console.log('Query Success. Row:', rows[0]);

    } catch (error) {
        console.error('Query Failed:', error.message);
    } finally {
        if (conn) await conn.end();
    }
}

testBookingsQuery();
