const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

async function checkJoinedData() {
    let conn;
    try {
        conn = await mysql.createConnection(dbConfig);
        console.log('Connected to database.');

        // 1. Show all Bookings
        const [bookings] = await conn.execute('SELECT id, user_id, tour_id FROM bookings');
        console.log('Bookings:', bookings);

        // 2. Show all Tours
        const [tours] = await conn.execute('SELECT id, title FROM tours');
        console.log('Tours:', tours);

        // 3. Show the Join Result (simulate what the API does)
        const [joined] = await conn.execute(`
      SELECT b.id as booking_id, b.tour_id, t.id as tour_table_id, t.title
      FROM bookings b
      LEFT JOIN tours t ON b.tour_id = t.id
    `);
        console.log('Joined Data:', joined);

    } catch (error) {
        console.error('Error:', error);
    } finally {
        if (conn) await conn.end();
    }
}

checkJoinedData();
