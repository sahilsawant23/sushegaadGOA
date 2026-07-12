const mysql = require('mysql2/promise');
const dotenv = require('dotenv');
const path = require('path');

dotenv.config({ path: path.join(__dirname, '..', 'backend', '.env') }); // Pointing to correct backend .env

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
};

async function checkRegions() {
    let conn;
    try {
        console.log("Connecting to:", dbConfig.host, dbConfig.database);
        conn = await mysql.createConnection(dbConfig);
        console.log('Connected.');
        const [rows] = await conn.execute('SELECT region, COUNT(*) as count FROM destinations GROUP BY region');
        console.table(rows);
    } catch (e) {
        console.error(e);
    } finally {
        if (conn) await conn.end();
    }
}
checkRegions();
