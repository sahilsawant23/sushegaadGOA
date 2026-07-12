const mysql = require('mysql2/promise');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const dbConfig = {
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'goa_db',
};

async function addRoleColumn() {
    let conn;
    try {
        conn = await mysql.createConnection(dbConfig);
        console.log('Connected to database.');

        // Check if column exists
        const [columns] = await conn.execute(`
            SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
            WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users' AND COLUMN_NAME = 'role'
        `, [dbConfig.database]);

        if (columns.length === 0) {
            console.log('Adding role column...');
            await conn.execute(`
                ALTER TABLE users 
                ADD COLUMN role ENUM('user', 'admin') DEFAULT 'user' AFTER password_hash
            `);
            console.log('✅ Role column added successfully.');
        } else {
            console.log('ℹ️ Role column already exists.');
        }

    } catch (error) {
        console.error('Migration failed:', error);
    } finally {
        if (conn) await conn.end();
    }
}

addRoleColumn();
