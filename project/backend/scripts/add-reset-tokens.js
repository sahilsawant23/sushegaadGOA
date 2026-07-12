const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrate() {
    const pool = mysql.createPool({
        host: process.env.DB_HOST || 'localhost',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '',
        database: process.env.DB_NAME || 'goa_db',
        waitForConnections: true,
        connectionLimit: 10,
        queueLimit: 0
    });

    try {
        const conn = await pool.getConnection();
        console.log('Connected to database.');

        // Check if columns exist
        const [columns] = await conn.execute(`
      SELECT COLUMN_NAME 
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users' AND COLUMN_NAME IN ('reset_token', 'reset_token_expiry')
    `, [process.env.DB_NAME || 'goa_db']);

        if (columns.length < 2) {
            console.log('Adding reset_token and reset_token_expiry columns...');
            await conn.execute(`
        ALTER TABLE users 
        ADD COLUMN reset_token VARCHAR(255) DEFAULT NULL,
        ADD COLUMN reset_token_expiry DATETIME DEFAULT NULL
      `);
            console.log('Columns added successfully.');
        } else {
            console.log('Columns already exist.');
        }

        conn.release();
        process.exit(0);
    } catch (error) {
        console.error('Migration failed:', error);
        process.exit(1);
    }
}

migrate();
