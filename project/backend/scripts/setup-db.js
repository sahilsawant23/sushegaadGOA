const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

const dbConfig = {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    multipleStatements: true // Enable multiple statements for schema
};

async function setupDatabase() {
    console.log('Connecting to MySQL server...');
    let conn;
    try {
        // Connect without database selected first
        conn = await mysql.createConnection(dbConfig);
        console.log('Connected. Running schema...');

        const schemaPath = path.join(__dirname, '..', 'sql-schema.sql');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        // Execute schema (contains CREATE DATABASE USE goa_db; etc)
        await conn.query(schemaSql);

        console.log('Database and Tables created successfully!');

        // Now verified, check role column just in case schema didn't have it (it should)
        // Re-connect to the specific DB to check
        await conn.changeUser({ database: process.env.DB_NAME || 'goa_db' });

        const [columns] = await conn.execute(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users' AND COLUMN_NAME = 'role'
    `, [process.env.DB_NAME || 'goa_db']);

        if (columns.length === 0) {
            console.log('Adding role column...');
            await conn.execute(`ALTER TABLE users ADD COLUMN role ENUM('user', 'admin') DEFAULT 'user' AFTER password_hash`);
        }

    } catch (error) {
        console.error('Setup failed:', error);
    } finally {
        if (conn) await conn.end();
    }
}

setupDatabase();
