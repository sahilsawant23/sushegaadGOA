require('dotenv').config();
const mysql = require('mysql2/promise');

async function testDb() {
    console.log('--- Testing DB Connection ---');
    console.log('DB_HOST:', process.env.DB_HOST);
    console.log('DB_USER:', process.env.DB_USER);
    // Don't log password fully for security, just length
    console.log('DB_PASSWORD length:', process.env.DB_PASSWORD ? process.env.DB_PASSWORD.length : 0);
    console.log('DB_NAME:', process.env.DB_NAME);

    try {
        const connection = await mysql.createConnection({
            host: 'localhost',
            user: 'root',
            password: '', // Testing empty password
            database: 'goa_db'
        });
        console.log('✅ Successfully connected to database!');
        await connection.end();
    } catch (error) {
        console.error('❌ Database connection failed:', error.message);
    }
}

testDb();
