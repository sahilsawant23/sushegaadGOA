const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
const mysql = require('mysql2/promise');

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'goa_db',
};

async function checkSchema() {
    console.log('Checking database schema...');
    let conn;
    try {
        conn = await mysql.createConnection(dbConfig);

        // Check if role column exists in users table
        const [columns] = await conn.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users' AND COLUMN_NAME = 'role'
    `, [dbConfig.database]);

        if (columns.length === 0) {
            console.log("Column 'role' missing in 'users' table. Adding it...");
            await conn.execute(`
        ALTER TABLE users 
        ADD COLUMN role ENUM('user', 'admin') DEFAULT 'user' AFTER password_hash
      `);
            console.log("Column 'role' added successfully.");
        } else {
            console.log("Column 'role' already exists.");
        }

    } catch (error) {
        console.error('Schema check failed:', error);
    } finally {
        if (conn) await conn.end();
    }
}

checkSchema();
